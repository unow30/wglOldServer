/**
 * Created by gunucklee on 2021. 07. 22.
 */

const paramUtil = require('../../common/utils/paramUtil');
const fileUtil = require('../../common/utils/fileUtil');
const mysqlUtil = require('../../common/utils/mysqlUtil');
const sendUtil = require('../../common/utils/sendUtil');
const errUtil = require('../../common/utils/errUtil');
const logUtil = require('../../common/utils/logUtil');

const errCode = require('../../common/define/errCode');

const RestClient = require('@bootpay/server-rest-client').RestClient;



module.exports =  function (req, res, next) {
    req.paramBody = paramUtil.parse(req);

    try {
        if (parseInt(req.paramBody["status"]) === 6) {
            let refund_price = 0;
            let refund_reward = 0;


            mysqlUtil.connectPool( async function (db_connection) {
                req.innerBody = {};

                req.innerBody['cancel_info'] = await queryCancelInfo(req, db_connection);


                refund_price = req.innerBody['cancel_info']['payment'];


                if( refund_price > req.innerBody['cancel_info']["cancelable_price"] ) {
                    refund_reward = refund_price - req.innerBody['cancel_info']['cancelable_price'] - req.innerBody['cancel_info']['use_point'];
                    refund_price = req.innerBody['cancel_info']["cancelable_price"];
                }

                // 배달비 + 취소 금액
                if(req.innerBody['cancel_info']['order_product_count'] === 1) {
                    req.innerBody['cancel_info']["cancelable_price"] >= req.innerBody['cancel_info']['payment'] ?
                            refund_price += req.innerBody['cancel_info']['price_delivery'] :
                            refund_reward += req.innerBody['cancel_info']['price_delivery']
                }

                if(!checkCancelable(req) ) {
                    errUtil.createCall(errCode.fail, `반품하기 위한 취소 금액이 부족합니다.`);
                }


                req.innerBody['refund_reward'] = refund_reward

                req.innerBody['bootpay_info'] = await queryReward(req,db_connection)

                req.innerBody['refund_price'] = refund_price;


                await queryCancelable(req, db_connection);

                if(refund_price > 0) {
                    RestClient.setConfig(
                        process.env.BOOTPAY_APPLICATION_ID,
                        process.env.BOOTPAY_PRIVATE_KEY,
                    );


                    console.log("zz:" + JSON.stringify(req.innerBody['bootpay_info']))
                    RestClient.getAccessToken().then(function (token) {
                        try {
                            if (token.status === 200) {
                                RestClient.cancel({
                                    receiptId: req.innerBody['bootpay_info']['pg_receipt_id'],
                                    price: refund_price,                               // "[[ 결제 취소할 금액 ]]"
                                    name: req.innerBody['bootpay_info']['nickname'],              // "[[ 취소자명 ]]"
                                    reason: req.paramBody['cancel_reason'] + req.paramBody['detail_reason'],   // "[[ 취소사유 ]]"
                                }).then(function (response) {
                                    // 결제 취소가 완료되었다면
                                    if (response.status === 200) {
                                        console.log(JSON.stringify(response));
                                        console.log("부트페이 성공..!!!");
                                        next();
                                    }
                                }).catch((e) => {
                                    sendUtil.sendErrorPacket(req, res, errUtil.initError(e.path, `결제 취소를 실패했습니다. 다시 시도해주세요.`));
                                    return;
                                });
                            }
                        } catch (e) {
                            let _err = errUtil.get(e);
                            sendUtil.sendErrorPacket(req, res, _err);
                        }
                    });
                }
                else {
                    next();
                }
            });
        }
        else {
            next();
        }


    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }

}

function checkCancelable(req) {
    const cancelable = req.innerBody['cancel_info']["cancelable_price"] + req.innerBody["cancel_info"]["use_reward"] + req.innerBody["cancel_info"]["use_point"];


    console.log("@@@@#@#@#@#@#@")
    console.log("cancelable :"  +  cancelable);

    console.log("req.innerBody['cancel_info']['payment'] :"  +  req.innerBody['cancel_info']['payment']);

    return (cancelable >= req.innerBody['cancel_info']['payment'])
            ? true : false;
}

function query(req, db_connection){
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_cancelable_price'
        , [
            req.paramBody['order_uid'],
        ]

    );
}

function queryReward(req, db_connection){
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call w_seller_update_refund_reward'
        , [
            req.paramBody['order_product_uid'],
            req.paramBody['refund_reward'],
        ]

    );
}

function queryCancelable(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_cancelable'
        , [
            req.paramBody['order_uid'],
            req.innerBody['refund_price'],
            req.paramBody['order_product_uid'],
        ]

    );
}


function queryReward(req, db_connection){
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call w_seller_update_refund_reward'
        , [
            req.paramBody['order_product_uid'],
            req.innerBody['refund_reward'],
        ]

    );
}

function queryCancelInfo(req, db_connection){
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_cancel_info'
        , [
            req.paramBody['order_uid'],
            req.paramBody['order_product_uid'],
        ]

    );
}


