/**
 * Created by yunhokim on 2023. 03. 08.
 */

const BootpayV2 = require('@bootpay/backend-js').Bootpay;
const sendUtil = require('../../legacy/origin/sendUtil');
const errUtil = require('../../legacy/origin/errUtil');

module.exports = {
    //부트페이 결제완료시 교차검증하고 결제승인하기
    /**
     * 0: 신용카드
     * 1: 카카오페이
     * 2: 무통장입금(사용안하는중)
     * 3: 가상계좌(사용안하는중)
     * 4: 네이버페이
     * 5: 포인트/리워드결제 =>이때 부트페이 거치지 않는다.
     * 6: 이벤트 상품증정 =>이때 부트페이 거치지 않는다.
     * 30: 가상계좌 결제완료(사용안하는중)
     * method: '카드결제',
     * method_symbol: 'card',
     * method_origin: '네이버페이',
     * method_origin_symbol: 'naverpay',
     * method: '카카오페이',
     * method_symbol: 'kakaopay',
     * method_origin: '카카오페이',
     * method_origin_symbol: 'kakaopay',
     * method: '카드',
     * method_symbol: 'card',
     * method_origin: '카드',
     * method_origin_symbol: 'card',
     **/
    PaymentCompletedCrossVerification: async (req, res, db_connection) => {
        //payment_method 단건결제 결과에서 결제방식 확인 후 서버에서 보내야 한다.
        // console.log(req.paramBody)
        if(req.paramBody.pg_receipt_id === ""){
            //포인트,리워드로 전체결제한 경우
            req.paramBody['payment_method'] = 5
            return await calculateOrderProductsPrice(req.paramBody, 0, db_connection);

        }else{
            let pgReceipt = await getBootPaySinglePayment(req.paramBody.pg_receipt_id);
            switch (pgReceipt.method_origin_symbol) {
                case 'card' : {
                    req.paramBody['payment_method'] = 0
                }break;
                case 'kakaopay': {
                    req.paramBody['payment_method'] = 1
                }break;
                case 'naverpay':{
                    req.paramBody['payment_method'] = 4
                }break
            }
            // if(pgReceipt.status === 2){ //1:결제완료, 2:승인대기
            if(pgReceipt.status === 2){ //1:결제완료, 2:승인대기
                return await calculateOrderProductsPrice(req.paramBody, pgReceipt.price, db_connection);
            }else{
                throw `부트페이 단건결제 상태 이상. pgReceipt.status: ${pgReceipt.status}`;
            }
        }
    },
    //부트페이 교차검증시 문제가 발생하면 결제 취소하기
    PaymentCancellationCrossVerification: () => {

    }
}

//pg사 단건결제
async function getBootPaySinglePayment(pg_receipt_id){
    BootpayV2.setConfiguration({
        application_id: process.env.BOOTPAY_APPLICATION_ID,
        private_key: process.env.BOOTPAY_PRIVATE_KEY,
    });
    //부트페이 단건결제건 가져오기
    try {
        await BootpayV2.getAccessToken();
        const receipt = await BootpayV2.receiptPayment(pg_receipt_id);
        return receipt
    }catch (e) {
        //{"error_code":"RC_NOT_FOUND","message":"영수증 정보를 찾지 못했습니다."}
        throw e.message
    }
}

async function calculateOrderProductsPrice(param, receiptPrice, db_connection){
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

    //주문상품이 공구인지 일반상품인기 구분해야 한다. 아니면 api를 따로 빼서 사용한다? 검증유틸도 따로 만들기

    let frontProductInfo = param['product_list'];
    let backProductInfo = await querySelectProductInfo(frontProductInfo, objectCalculate['pg_receipt_id'], db_connection);
    await compareProductInfo(frontProductInfo, backProductInfo, objectCalculate['pg_receipt_id'], function (compared) {
        objectCalculate['priceTotal'] += compared['priceTotal']
        objectCalculate['sellerArr'].push({
            seller_uid: compared['seller_uid'],
            price_delivery: compared['price_delivery'],
        })
    })

    //배송비 중복제외
    objectCalculate['sellerArr'] = [...new Set(objectCalculate['sellerArr'].map(seller => JSON.stringify(seller)))].map(str => JSON.parse(str));
    objectCalculate['sellerArr'].forEach(el =>{
        objectCalculate['totalDelivery'] += el['price_delivery']
    })

    //판매자 지불금액총합 계산
    objectCalculate['totalPayment'] =
        objectCalculate['priceTotal'] + objectCalculate['totalDelivery']
      - (objectCalculate['totalReward'] + objectCalculate['totalPoint'])
    console.log('검증결과')
    console.table([{'pg결제금액': receiptPrice, '검증결제금액':objectCalculate['totalPayment']}], ['pg결제금액','검증결제금액'])

    if(receiptPrice === objectCalculate['totalPayment']) {
       return await funcD(objectCalculate);
    }else{
       //결제금액이 맞지 않으니 pg결제를 취소해야 한다. 전체취소 진행한다.
       throw await funcC(`결제금액과 검증금액이 맞지 않습니다. 결제를 취소합니다.`)
    }
}

//상품정보, 상품옵션정보를 조인해서 하나씩 가져온다. 여러개를 한번에 가져오기 어렵다.
//공구결제라면 상품정보를 가져와도 소용없잖어 공구가격을 검증해야 하는데
async function querySelectProductInfo(frontProductList, pg_receipt_id, db_connection) {
    //상품정보 옵션정보까지 조인해서 하나씩 불러오기
    return await Promise.all(frontProductList.map(async (product_list) => {
        return new Promise(async (resolve, reject) => {
            const checkProductData = `
                select
                    p.uid as product_uid
                    , p.user_uid as seller_uid
                    , p.name as product_name
                    , p.price_original
                    , p.price_discount
                    , p.is_authorize
                    , p.is_deleted
                    , p.sale_type
                    , sum(po.option_price) as option_price
                    , group_concat(po.name separator ' / ') as option_name
                from tbl_product as p
                inner join tbl_product_option as po
                    on po.product_uid = ${product_list['product_uid']}
                    and find_in_set(po.option_id, '${product_list['option_ids']}')
                where p.uid = (${product_list['product_uid']})
            ;`;
            await db_connection.query(checkProductData, async (err, rows, fields) => {
                if (err) {
                    reject(await funcC('db상품정보 검색 연결 실패'));
                } else if (rows.length === 0) {
                    reject(await funcC(`상품정보를 찾을 수 없습니다.`));
                } else {
                    resolve(rows[0]);
                }
            });
        });
    })).then(value => {
        return value
    })
    //     .catch(err =>{
    //     console.log('promise.all catch부분')
    //     throw err
    // })
}

//서버와 클라이언트간 데이터 검증 필터
async function compareProductInfo(frontProductInfo, backProductInfo, pg_receipt_id, calculateCallback){
    if (frontProductInfo.length !== backProductInfo.length) {
        throw await funcC(`결제할 상품 종류가 일치하지 않습니다. 클라이언트:${frontProductInfo.length}개, 서버:${backProductInfo.length}개`)
    }

    frontProductInfo.sort(function(x, y) {
        return x['product_uid'] - y['product_uid'];
    });

    backProductInfo.sort(function(x, y) {
        return x['product_uid'] - y['product_uid'];
    });

    console.log('클라이언트, 서버 정보비교')
    for (let i = 0; i < backProductInfo.length; i++) {
        const aElem = frontProductInfo[i];
        const bElem = backProductInfo[i];

        console.table({roof:i,
            product_uid: aElem['product_uid'] === bElem['product_uid'],
            seller_uid: aElem['seller_uid'] === bElem['seller_uid'],
            priceTotal: aElem['price_original'] * aElem['count'] === (bElem['price_discount'] + bElem['option_price']) * aElem['count']
        })

        if(aElem['product_uid'] !== bElem['product_uid']){
        // if(aElem['product_uid'] !== 1){
            throw (await funcC(`상품번호가 일치하지 않습니다. product_uid: ${aElem['product_uid']}`))
        }
        if(aElem['seller_uid'] !== bElem['seller_uid']){
        // if(aElem['seller_uid'] !== 0){
            throw (await funcC(`판매자번호가 일치하지 않습니다. seller_uid: ${aElem['seller_uid']}`))
        }

        if(aElem['price_original'] * aElem['count'] !== (bElem['price_discount'] + bElem['option_price']) * aElem['count']){
        // if(aElem['price_discount'] * aElem['count'] !== bElem['price_discount'] * 1){
            throw (await funcC(`결제금액이 서버와 일치하지 않습니다.`))
        }

        let compared = {
            priceTotal: aElem['price_original'] * aElem['count'],
            seller_uid: aElem['seller_uid'],
            price_delivery: aElem['price_delivery']
        }
        //검증 완료되면 objectCalculate에 데이터 입력하기: seller_uid, price_discount, count
        calculateCallback(compared)
    }

}

//결제금액이 일치하지 않으면 pg사 결제내역 전체 취소한다.
async function funcC(errMsg){
    return new Error(errMsg)
}

// async function funcD(objectCalculate, callback){
async function funcD(objectCalculate){
    try {
        if(objectCalculate['pg_receipt_id'] !== ""){
            const response = await BootpayV2.confirmPayment(objectCalculate['pg_receipt_id'])
            console.log(response)
            console.log('결제승인 진행')
        }
        return objectCalculate
    } catch (e) {
        //{ error_code: 'RC_NOT_FOUND', message: '영수증 정보를 찾지 못했습니다.' }
        throw await funcC(e.message)
        // throw e
    }
}