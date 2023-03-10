/**
 * Created by yunhokim on 2023. 03. 08.
 */

const BootpayV2 = require('@bootpay/backend-js').Bootpay;
const sendUtil = require('../../legacy/origin/sendUtil');

module.exports = {
    //부트페이 결제완료시 교차검증하고 결제승인하기
    PaymentCompletedCrossVerification: async (req, res, db_connection, createDBCallback) => {
        let param = req.paramBody

        BootpayV2.setConfiguration({
            application_id: process.env.BOOTPAY_APPLICATION_ID,
            private_key: process.env.BOOTPAY_PRIVATE_KEY,
        })

        //부트페이 단건결제건 가져오기
        await BootpayV2.getAccessToken();
        const receipt = await BootpayV2.receiptPayment(param['pg_receipt_id']);
        if(receipt.status ===1){
            await calculateOrderProductsPrice(receipt.price, param, db_connection, createDBCallback)
        }else{
            //1이 아니면 문제가 있다고 생각하여 결제취소함수 실행?
            throw `부트페이 단건결제 상태 이상. status: ${receipt.status}`
        }
    },

    //부트페이 교차검증시 문제가 발생하면 결제 취소하기
    PaymentCancellationCrossVerification: () => {

    }
}


//pg단건조회 status 1이면 주문한 상품들 가격계산
async function calculateOrderProductsPrice(receiptPrice, param, db_connection, createDBCallback){
    //product_list의 상품금액, 판매금액, 배송금액 계산
    let objectCalculate = {
        priceTotal: 0,
        totalPayment: 0,
        totalDelivery: 0,
        totalReward: param['use_reward']? param['use_reward'] : 0,
        totalPoint: param['use_point']? param['use_point'] : 0,
        sellerArr: [],
        pg_receipt_id: param['pg_receipt_id']
    }

    // for(const idx in param['product_list']) {
    //     let frontProductInfo = param['product_list'][idx];
    //     let backProductInfo = await querySelectProductInfo(frontProductInfo, objectCalculate['pg_receipt_id'], db_connection);
    //     await filterProductInfo(frontProductInfo, backProductInfo, objectCalculate['pg_receipt_id'], function () {
    //         //배송비 정보 수집
    //         objectCalculate['priceTotal'] += frontProductInfo['price_original'] * frontProductInfo['count']
    //         objectCalculate['sellerArr'].push({
    //             seller_uid: frontProductInfo['seller_uid'],
    //             price_delivery: frontProductInfo['price_delivery'],
    //         })
    //     })
    // }

    let frontProductInfo = param['product_list'];
    let backProductInfo = await querySelectProductInfo(frontProductInfo, objectCalculate['pg_receipt_id'], db_connection);
    await filterProductInfo(frontProductInfo, backProductInfo, objectCalculate['pg_receipt_id'], function () {
        //배송비 정보 수집
        objectCalculate['priceTotal'] += frontProductInfo['price_original'] * frontProductInfo['count']
        objectCalculate['sellerArr'].push({
            seller_uid: frontProductInfo['seller_uid'],
            price_delivery: frontProductInfo['price_delivery'],
        })
    })

    //배송비 중복제외
    //배송비 계산. 무료배송인줄 어떻게 검증하지? 프론트 최종지불가격이 서버와 다르면 계산이 잘못 된 것으로 알 수 있다.
    objectCalculate['sellerArr'] = [...new Set(objectCalculate['sellerArr'])];
    objectCalculate['sellerArr'].forEach(el =>{
        objectCalculate['totalDelivery'] += el['price_delivery']
    })

    //판매자 지불금액총합 계산
    objectCalculate['totalPayment'] = objectCalculate['priceTotal'] + objectCalculate['totalDelivery'] - (objectCalculate['totalReward'] + objectCalculate['totalPoint'])

    //receiptPrice와 검증한 결제금액 정보 비교해서 맞으면 넘어간다.
    if(receiptPrice === objectCalculate['totalPayment']) {
    // if(1 === objectCalculate['totalPayment']) {
       //결제내역 승인 진행
       return createDBCallback(objectCalculate)
    }else{
       // '잘못된 결제내역'
       console.log('pg결제금액',receiptPrice)
       console.log('검증결제금액',objectCalculate['totalPayment'])
       console.log(objectCalculate)
       //결제금액이 맞지 않으니 pg결제를 취소해야 한다. 전체취소 진행한다.
        let a = await funcC(param['pg_receipt_id'], `결제금액과 검증금액이 맞지 않습니다. 결제를 취소합니다.`)
        throw a
    }
}

async function querySelectProductInfo(frontProductList, pg_receipt_id, db_connection) {
    //product_uid로 상품정보 n개를 가져온다.
    let productUids = [];
    // for(const idx in frontProductList){
    //     productUids.push(frontProductList[idx]['product_uid'])
    // }
    for(const product_list of frontProductList){
        productUids.push(product_list['product_uid'])
    }
    const checkProductData = `
        select p.uid as product_uid
            , p.user_uid as seller_uid
            , p.name as product_name
            , p.price_original
            , p.price_discount
            , p.is_authorize
            , p.is_deleted
            , p.sale_type
        from tbl_product as p
        where p.uid in(${productUids})
    ;`
    // where p.uid in (${productUids})


    return new Promise(async (resolve, reject) => {
        await db_connection.query(checkProductData, async (err, rows, fields)=>{
            if(err){
                reject(await funcC(pg_receipt_id, 'db상품정보 검색 연결 실패'))
            }else if(rows.length === 0){
                //빈 배열 리턴: product_uid가 db에 없는 값일 경우 db단에서 에러가 난 것으로 보고싶다.
                // reject(await funcC(pg_receipt_id, `상품정보를 찾을 수 없습니다. product_uid = ${param['product_uid']}`))
                reject(await funcC(pg_receipt_id, `상품정보를 찾을 수 없습니다.`))
            }else{
                // resolve(rows[0])
                console.log(rows)
                resolve(rows)
            }
        })
    })
}

//서버와 클라이언트간 데이터 검증 필터
async function filterProductInfo(frontProductInfo, backProductInfo, pg_receipt_id, calculateCallback){
    // return new Promise(async (resolve, reject) => {
    //     if(backProductInfo['product_uid'] !== frontProductInfo['product_uid']){
    //         reject(await funcC(pg_receipt_id, `상품번호가 일치하지 않습니다. product_uid: ${frontProductInfo['product_uid']}`))
    //     }
    //
    //     if(backProductInfo['seller_uid'] !== frontProductInfo['seller_uid']){
    //         reject(await funcC(pg_receipt_id, `판매자번호가 일치하지 않습니다. seller_uid: ${frontProductInfo['seller_uid']}`))
    //     }
    //
    //     // if(backProductInfo['price_discount'] * frontProductInfo['count'] !== frontProductInfo['payment']){
    //     if(backProductInfo['price_discount'] * frontProductInfo['count'] !== frontProductInfo['price_original'] * frontProductInfo['count']){
    //         reject(await funcC(pg_receipt_id, '결제금액이 서버와 일치하지 않습니다.'))
    //     }
    //     calculateCallback()
    // })
    for(let product_info of backProductInfo){
        if(product_info['product_uid'] !== frontProductInfo['product_uid']){
            throw (await funcC(pg_receipt_id, `상품번호가 일치하지 않습니다. product_uid: ${frontProductInfo['product_uid']}`))
        }
        if(product_info['seller_uid'] !== frontProductInfo['seller_uid']){
            throw (await funcC(pg_receipt_id, `판매자번호가 일치하지 않습니다. seller_uid: ${frontProductInfo['seller_uid']}`))
        }
        if(product_info['price_discount'] * frontProductInfo['count'] !== frontProductInfo['price_original'] * frontProductInfo['count']){
            throw (await funcC(pg_receipt_id, '결제금액이 서버와 일치하지 않습니다.'))
        }
    }

    calculateCallback()


}

//결제금액이 일치하지 않으면 pg사 결제내역 전체 취소한다.
async function funcC(pg_receipt_id, errMsg){
    //부트페이 취소 로직 실행
    // const response = await BootpayV2.cancelPayment({
    //     receipt_id: pg_receipt_id222,
    //     // cancel_price: '[ 취소 금액 ]' 없으면 전체취소한다.,
    //     cancel_tax_free: '[ 취소 면세금액 ]',
    //     cancel_id: '[ 가맹점 취소 고유 ID ]',
    //     cancel_username: '유저닉네임?',//'[ 취소자명 ]',
    //     cancel_message: `결제금액 검증실패.` //'[ 취소 메세지 ]'
    // })
    // console.log(response)
    let a = await foo()
    console.log(a)
    console.log(`${pg_receipt_id} 결제 취소`)
    return new Error(errMsg)
}

async function foo() {
    return 123
}