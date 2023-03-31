const fileUtil = require('../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../common/utils/legacy/origin/logUtil');
const paramUtil = require('../../../../common/utils/legacy/origin/paramUtil');

const errCode = require('../../../../common/define/errCode');

const bootpayCrossVerificationUtil = require('../../../../common/utils/v3/bootpay/bootpayCrossVerificationUtil')

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    try{
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);
        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};
            // 선물하기 검증하기: 검증 완료시 주문기록
            const calculateObj = await bootpayCrossVerificationUtil.paymentCompletedCrossVerification(req, res, 'gift', db_connection)
            console.log('검증된 결제금액')
            console.log(calculateObj)

            // 선물하기 주문 실행
            // const {order_uid, gift_uid} = await query(req, calculateObj, db_connection);
            const orderInfo = await query(req, calculateObj, db_connection);
            if (!orderInfo) {
                errUtil.createCall(errCode.fail, `상품구매에 실패하였습니다.`)
                return
            }
            // req.innerBody['item'] = {order_uid: orderInfo['order_uid'], gift_uid: orderInfo['gift_uid']};
            req.innerBody['order_uid'] = orderInfo['order_uid'];
            req.innerBody['gift_uid'] = orderInfo['gift_uid'];


            // 선물 결제하기 상태 0
            for( let idx in req.paramBody['product_list'] ){
                let product = req.paramBody['product_list'][idx]
                product['order_uid'] = req.innerBody['order_uid'];
                await queryProduct(req, product, db_connection);
            }

            // 리워드 사용시 사용정보 기록
            if(req.paramBody['use_reward'] > 0 ) {
                await queryReward(req, orderInfo, db_connection);
            }
            // 포인트 사용시 사용정보 기록
            if(req.paramBody['use_point'] > 0) {
                await queryPoint(req, orderInfo, db_connection);
            }

            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        })

    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function query(req, calculateObj, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_gift_order'
        , [
            req.headers['user_uid'],
            0,
            calculateObj['totalPoint'],//req.paramBody['use_point'],
            calculateObj['totalReward'],//req.paramBody['use_reward'],
            calculateObj['priceTotal'],//req.paramBody['price_total'],
            calculateObj['totalDelivery'],//req.paramBody['delivery_total'],
            calculateObj['totalPayment'],//req.paramBody['price_payment'],
            calculateObj['pg_receipt_id'],//req.paramBody['pg_receipt_id'],
            null,
            null,
            null,
            req.paramBody['payment_method'],
            req.paramBody['recipient_name'],
            req.paramBody['msg_card']
        ]
    );
}

function queryProduct(req, product, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_gift_order_product'
        , [
            req.headers['user_uid'],
            product['order_uid'],
            product['product_uid'],
            product['seller_uid'],
            product['video_uid'],
            product['option_ids'],
            product['count'],
            product['price_original'],
            product['payment'],
            product['price_delivery'],
            0,
        ]
    );
}

function queryReward(req, orderInfo, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_use_reward'
        , [
            req.headers['user_uid'],
            orderInfo['seller_uid'],
            orderInfo['order_uid'],
            orderInfo['order_no'],
            2,
            req.paramBody['use_reward'],
            '상품 구매에 리워드 사용',
        ]
    );
}

function queryPoint(req, orderInfo, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_use_point'
        , [
            req.headers['user_uid'],
            orderInfo['order_no'],
            2,
            req.paramBody['use_point'] * -1,
            '상품 구매에 포인트 사용'
        ]
    );
}