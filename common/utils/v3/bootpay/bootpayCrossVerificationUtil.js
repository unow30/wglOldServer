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
    //부트페이 결제 검증하기
    paymentCompletedCrossVerification: async (req, res, type, db_connection) => {
        //payment_method 단건결제 결과에서 결제방식 확인 후 서버에서 보내야 한다.

        if(req.paramBody.pg_receipt_id === ""){
            //포인트,리워드로 전체결제한 경우
            req.paramBody['payment_method'] = 5
            return await calculateOrderProductsPrice(req.paramBody, 0, type, db_connection);

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
            if(pgReceipt.status === 2){ //1:결제완료, 2:승인대기
            // if(pgReceipt.status === 2){ //1:결제완료, 2:승인대기
                return await calculateOrderProductsPrice(req.paramBody, pgReceipt.price, type, db_connection);
            }else{
                throw `부트페이 단건결제 상태 이상. pgReceipt.status: ${pgReceipt.status}`;
            }
        }
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

async function calculateOrderProductsPrice(param, receiptPrice, type, db_connection){
    //product_list의 상품금액, 판매금액, 배송금액 계산
    let objectCalculate = {
        priceTotal: 0,
        totalPayment: 0,
        totalDelivery: 0,
        totalReward: param['use_reward']? param['use_reward'] : 0,
        totalPoint: param['use_point']? param['use_point'] : 0,
        isLand: 0,
        sellerArr: [],
        pg_receipt_id: param['pg_receipt_id']
    }

    //클라이언트에서 도서산간여부를 true, false 등으로 받아온다?
    //주소uid로 zipcode를 가져와 도서산간지역인지 체크한다.
    //선물하기는 주소입력을 안한다.
    if(type !== 'gift'){
        await queryCheckIsland(param['addressbook_uid'], db_connection).then(res => {
            if(res === 1){
                objectCalculate['isLand'] = 1
            }
        });
    }

    //서버에서 일반상품정보를 가져온다.
    let frontProductInfo = param['product_list'];
    let backProductInfo;
    //결제방식에 따라 검증함수가 달라야 한다.
    switch(type){
        case 'common': {
            //일반결제검증함수
            backProductInfo = await querySelectProductInfo(frontProductInfo, db_connection);
        } break;

        case 'gift': {
            //선물하기 함수
            backProductInfo = await querySelectProductInfo(frontProductInfo, db_connection);
        } break;

        case 'groupbuying': {
            //공동구매결제함수
            //groupbuyingInfo, productInfo 둘 다 필요
            // backProductInfo = await queryGroupbuyingProductInfo(param, db_connection);
            return await paymentApproval(objectCalculate);
        } break;
    }

    //클라이언트와 서버의 상품정보를 비교 검증한 결과를 objectCalculate에 저장한다.
    compareProductInfo(frontProductInfo, backProductInfo, function (compared) {
        objectCalculate['priceTotal'] += compared['priceTotal']
        objectCalculate['sellerArr'].push({
            seller_uid: compared['seller_uid'],
            price_delivery: compared['price_delivery'],
            delivery_free: compared['delivery_free'],
            delivery_price_plus: compared['delivery_price_plus'],
            price_total: compared['priceTotal']
        })
    })

    console.log('중복 제거 전', objectCalculate)
    //objectCalculate의 배송비 중복을 제거하고 배송비를 계산한다.
    removeAndCalculateDuplicateSellerArr(objectCalculate);
    console.log('중복 제거 및 가격 계산 결과',objectCalculate)

    //판매자 지불금액총합 계산
    objectCalculate['totalPayment'] =
        objectCalculate['priceTotal'] + objectCalculate['totalDelivery']
      - (objectCalculate['totalReward'] + objectCalculate['totalPoint'])
    console.log('검증결과')
    console.table([{'pg결제금액': receiptPrice, '검증결제금액':objectCalculate['totalPayment']}], ['pg결제금액','검증결제금액'])

    if(receiptPrice === objectCalculate['totalPayment']) {
       return await paymentApproval(objectCalculate);
    }else{
       //결제금액이 맞지 않으니 pg결제를 취소해야 한다. 전체취소 진행한다.
       throw await sendError(`결제금액과 검증금액이 맞지 않습니다. 결제를 취소합니다.`)
    }
}

//일반결제 상품정보 가져오기
async function querySelectProductInfo(frontProductList, db_connection) {
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
                    , s.delivery_price
                    , s.delivery_free
                    , s.delivery_price_plus
                from tbl_product as p
                inner join tbl_product_option as po
                    on po.product_uid = ${product_list['product_uid']}
                    and find_in_set(po.option_id, '${product_list['option_ids']}')
                inner join tbl_user as s
                    on s.uid = p.user_uid
                   and s.is_seller = 1 
                where p.uid = (${product_list['product_uid']})
            ;`;
            await db_connection.query(checkProductData, async (err, rows, fields) => {
                if (err) {
                    reject(sendError('db상품정보 검색 연결 실패'));
                } else if (rows.length === 0) {
                    reject(sendError(`상품정보를 찾을 수 없습니다.`));
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

//공동구매 상품정보 가져오기
async function queryGroupbuyingProductInfo(param, db_connection){
    // groupbuying_room_uid
    //
    // 공구방 '생성'시에는 0으로 한다.
    //     공구방 '참가'시에는 참가할 공구방 uid 입력
    // recruitment
    //
    // 공구방 '생성'시 참여가능한 인원수를 입력한다(2,5,10)
    // 공구방 '참가'시 참여가능 인원수를 받지 않아도 된다(0으로 줘도 됨)


    const {
        groupbuying_uid,
        groupbuying_room_uid,
        recruitment,
        groupbuying_option_uid,
    } = param;
    const frontProductList = param['product_list'];

    return await Promise.all(frontProductList.map(async (product_list) => {
        return new Promise(async (resolve, reject) => {
            const query = `
                select
                    p.uid as product_uid
                    , p.user_uid as seller_uid
                    , p.name as product_name
                    , p.price_original as price_original
                    , gt.gongu_price as price_discount
                    , go.option_price as option_price
                    , go.name as option_name
                    , 0 as delivery_price
                    , 0 as delivery_free
                    , s.delivery_price_plus
                from tbl_product as p
                    inner join tbl_group_buying as gb
                        on gb.product_uid = p.uid
                        and gb.is_authorized = 1
                        and gb.soldout = 0
                        and gb.end_time >= now()
                    inner join tbl_user as s
                        on s.uid = p.user_uid
                        and s.is_seller = 1
                    inner join tbl_group_buying_options as go
                        on go.group_buying_uid = gb.uid
                        and go.uid = ${groupbuying_option_uid}
                        and go.soldout = 0
                        and go.sales_quantity > '주문수량'
                    inner join tbl_group_buying_types as gt
                        on gt.group_buying_uid = gb.uid
                       and gt.type =  
                where p.uid = product_list['uid']
            ;`;
            await db_connection.query(checkProductData, async (err, rows, fields) => {
                if (err) {
                    reject(sendError('db상품정보 검색 연결 실패'));
                } else if (rows.length === 0) {
                    reject(sendError(`상품정보를 찾을 수 없습니다.`));
                } else {
                    resolve(rows[0]);
                }
            });
        });
    })).then(value => {
        return value
    })
}

//도서산간지역 확인
async function queryCheckIsland(addressbookUid, db_connection){
    return new Promise((resolve, reject) =>{
        const queryAddress = `select zipcode from tbl_addressbook where uid = ${addressbookUid}`

        db_connection.query(queryAddress, (err, rows, field) =>{
            console.log('zipcode: ',rows[0]['zipcode'])
            if (err) {
                reject(sendError('배송주소를 찾을 수 없습니다.'));
            } else if(rows[0].length <= 0){
                reject(sendError('배송주소를 찾을 수 없습니다.'));
            } else {
                const queryIsland = `select if(count(uid) > 0, ${true}, ${false}) as island
                                     from tbl_island_area_v2 where zipcode = ${rows[0]['zipcode']}`

                db_connection.query(queryIsland, (err, rows, field) => {
                    if(err) {
                        reject(sendError('도서산간지역 확인 에러'));
                    }else{
                        console.log('도서산간지역')
                        resolve(rows[0]['island']);
                    }
                });
            }
        });
    });
}

//서버와 클라이언트간 상품정보 검증 필터
function compareProductInfo(frontProductInfo, backProductInfo, calculateCallback){
    if (frontProductInfo.length !== backProductInfo.length) {
        throw sendError(`결제할 상품 종류가 일치하지 않습니다. 클라이언트:${frontProductInfo.length}개, 서버:${backProductInfo.length}개`)
    }

    frontProductInfo.sort(function(x, y) {
        return x['product_uid'] - y['product_uid'];
    });

    backProductInfo.sort(function(x, y) {
        return x['product_uid'] - y['product_uid'];
    });

    console.log('클라이언트, 서버 정보비교')
    for (let i = 0; i < backProductInfo.length; i++) {
        const fElem = frontProductInfo[i];
        const bElem = backProductInfo[i];

        // console.table({roof:i,
        //     product_uid: fElem['product_uid'] === bElem['product_uid'],
        //     seller_uid: fElem['seller_uid'] === bElem['seller_uid'],
        //     priceTotal: fElem['price_original'] * fElem['count'] === (bElem['price_discount'] + bElem['option_price']) * fElem['count']
        // })

        const log = {}
        log.product_uid = new ConsoleValidate(fElem['product_uid'], bElem['product_uid'])
        log.seller_uid = new ConsoleValidate(fElem['seller_uid'], bElem['seller_uid'])
        log.priceTotal = new ConsoleValidate(fElem['price_original'] * fElem['count'], (bElem['price_discount'] + bElem['option_price']) * fElem['count'])
        log.delivery = new ConsoleValidate(fElem['price_delivery'], bElem['delivery_price'])
        console.log(`roof: ${i}`);
        console.table(log);

        if(fElem['product_uid'] !== bElem['product_uid']){
        // if(fElem['product_uid'] !== 1){
            throw (sendError(`상품번호가 일치하지 않습니다. product_uid: ${fElem['product_uid']}`))
        }
        if(fElem['seller_uid'] !== bElem['seller_uid']){
        // if(fElem['seller_uid'] !== 0){
            throw (sendError(`판매자번호가 일치하지 않습니다. seller_uid: ${fElem['seller_uid']}`))
        }

        if(fElem['price_original'] * fElem['count'] !== (bElem['price_discount'] + bElem['option_price']) * fElem['count']){
        // if(fElem['price_discount'] * fElem['count'] !== bElem['price_discount'] * 1){
            throw (sendError(`결제금액이 서버와 일치하지 않습니다.`))
        }

        if(Number(fElem['price_delivery']) !== Number(bElem['delivery_price'])){
            throw (sendError('배송비가 서버와 일치하지 않습니다.'))
        }

        let compared = {
            priceTotal: fElem['price_original'] * fElem['count'],
            seller_uid: fElem['seller_uid'],
            price_delivery: fElem['price_delivery'],
            delivery_free: bElem['delivery_free'],
            delivery_price_plus: bElem['delivery_price_plus']
        }
        //검증 완료되면 objectCalculate에 데이터 입력하기: seller_uid, price_discount, count
        calculateCallback(compared)
    }

}

//배송비 중복제외, price_total값은 더한다.
function removeAndCalculateDuplicateSellerArr(objectCalculate){
    //배송비 중복제외. 단 price_total값은 판매자별로 더해야 한다.
    objectCalculate['sellerArr'] = objectCalculate['sellerArr'].reduce((acc, seller) => {
        const existingSeller = acc.find(item => item.seller_uid === seller.seller_uid);
        if (existingSeller) {
            existingSeller.price_total += seller.price_total;
        } else {
            acc.push(seller);
        }
        return acc;
    }, []);

    objectCalculate['sellerArr'].forEach(el => {
       //판매자 하나의 판매가격 총합이 무료배송 조건보다 작으면 배송비 부과
       if(el['price_total'] < el['delivery_free']){
           objectCalculate['totalDelivery'] += el['price_delivery'];
       }
       //도서산간지역 배송이면 도서산간 추가배송비 부과
       if(objectCalculate['isLand'] === 1){
           objectCalculate['totalDelivery'] += el['delivery_price_plus'];
       }
   })

}

//결제금액이 일치하지 않으면 pg사 결제내역 전체 취소한다.
function sendError(errMsg){
    return new Error(errMsg)
}

//결제금액이 검증되면 결제승인을 진행(이 때 비용계산된다)
async function paymentApproval(objectCalculate){
    try {
        if(objectCalculate['pg_receipt_id'] !== ""){
            const response = await BootpayV2.confirmPayment(objectCalculate['pg_receipt_id'])
            console.log(response)
            console.log('결제승인 진행')
        }
        return objectCalculate
    } catch (e) {
        //{ error_code: 'RC_NOT_FOUND', message: '영수증 정보를 찾지 못했습니다.' }
        throw await sendError(e.message)
        // throw e
    }
}


function ConsoleValidate(fElem, bElem) {
    this.front = fElem;
    this.back = bElem;
    this.trueFalse = fElem === bElem
}