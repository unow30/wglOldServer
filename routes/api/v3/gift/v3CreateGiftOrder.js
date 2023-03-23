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
    //검증 미들웨어의 '행동'이 중요한거지 미들웨어에서 '검증'과정을 위해 db호출하는게 문제가 되지는 않다.
    //선물하기는 미들웨어에서 데이터 검증 '행동'을 하고 여기에서 선물하기생성을 '행동'하는 것으로 한다.
    //이전처럼 connectPool(asyncFunc, errorHandler){};여기서 이 함수 아래에서 모든 동작을 실행한다?
    //여기를 컨트롤러처럼 사용할거니까 모델에서 db 관련정보를 가지고 있는다. 대신 connectPool(asyncFunc, errorHandler){};은 여기에 작성한다?
    try{
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        // logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};
            // 선물하기 검증하기: 검증 완료시 주문기록
            const calculateObj = await bootpayCrossVerificationUtil.PaymentCompletedCrossVerification(req, res, db_connection)
            console.log(calculateObj)

            // 선물하기 주문 실행
            req.innerBody['item'] = await query(req, calculateObj, db_connection);
            if (!req.innerBody['item']) {
                errUtil.createCall(errCode.fail, `상품구매에 실패하였습니다.`)
                return
            }

            // 선물 결제하기 상태 0
            for( let idx in req.paramBody['product_list'] ){
                req.innerBody['product'] = req.paramBody['product_list'][idx]
                console.log("req.innerBody['item']['uid'] " + req.innerBody['item']['uid']);
                // req.innerBody['item'] = await queryProduct(req, db_connection)
                await queryProduct(req, db_connection);
            }

            // 리워드 사용시 사용정보 기록
            if(req.paramBody['use_reward'] > 0 ) {
                req.innerBody['reward'] = await queryReward(req, db_connection);
            }
            // 포인트 사용시 사용정보 기록
            if(req.paramBody['use_point'] > 0) {
                req.innerBody['point'] = await queryPoint(req, db_connection);
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

function queryProduct(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_gift_order_product'
        , [
            req.headers['user_uid'],
            req.innerBody['item']['uid'],
            req.innerBody['product']['product_uid'],
            req.innerBody['product']['seller_uid'],
            req.innerBody['product']['video_uid'],
            req.innerBody['product']['option_ids'],
            req.innerBody['product']['count'],
            req.innerBody['product']['price_original'],
            req.innerBody['product']['payment'],
            req.innerBody['product']['price_delivery'],
            0,
        ]
    );
}

function queryReward(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_use_reward'
        , [
            req.headers['user_uid'],
            req.innerBody['item']['seller_uid'],
            req.innerBody['item']['uid'],
            req.innerBody['item']['order_no'],
            2,
            req.paramBody['use_reward'],
            '상품 구매에 리워드 사용',
        ]
    );
}

function queryPoint(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_use_point'
        , [
            req.headers['user_uid'],
            req.innerBody['item']['order_no'],
            2,
            req.paramBody['use_point'] * -1,
            '상품 구매에 포인트 사용'
        ]
    );
}