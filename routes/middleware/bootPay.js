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
        if (parseInt(req.paramBody["status"]) === 6 || parseInt(req.paramBody["status"]) === 0) {


            mysqlUtil.connectPool( async function (db_connection) {
                req.innerBody = {};

                req.innerBody['cancel_info'] = await queryCancelInfo(req, db_connection);

                req.innerBody['cancel_info']['result_price'] = req.innerBody['cancel_info']['refund_payment'];

                // const _payment = req.innerBody['cancel_info']['refund_payment'];

                req = checkCancelableDelivery(req, req.innerBody['cancel_info']['refund_payment']);

                // ex code
                req = checkCancelablePayment(req);

                console.log("gwegaewhgwo");
                console.log("gwegaewhgwo1: " + req.innerBody['cancel_info']["cancelable_point"]);
                console.log("gwegaewhgwo2: " + req.innerBody['cancel_info']["result_price"]);

                req.innerBody['bootpay_info'] = await queryReward(req,db_connection)

                if(req.innerBody['cancel_info']['refund_payment'] > 0 || req.innerBody['cancel_info']['refund_reward'] > 0 || req.innerBody['cancel_info']['cancelable_point'] > 0)
                    await queryCancelablePrice(req, db_connection);


                if(req.innerBody['cancel_info']['refund_payment']  > 0) {
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
                                    price: req.innerBody['cancel_info']['refund_payment'] ,                               // "[[ 결제 취소할 금액 ]]"
                                    name: req.innerBody['bootpay_info']['nickname'],              // "[[ 취소자명 ]]"
                                    reason: parseInt(req.paramBody["status"]) === 0 ?
                                        '선물 거절' :
                                        req.paramBody['cancel_reason'] + req.paramBody['detail_reason'],   // "[[ 취소사유 ]]"
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


function checkCancelablePayment(req) {

    console.log("doasidjkaspiodaks");
    console.log("doasidjkaspiodaks1: " + req.innerBody['cancel_info']["cancelable_price"]);
    console.log("doasidjkaspiodaks2: " + req.innerBody['cancel_info']["result_price"]);

    if( req.innerBody['cancel_info']["cancelable_price"]  <= req.innerBody['cancel_info']["result_price"] ) {
    // if( req.innerBody['cancel_info']["cancelable_price"]  < req.innerBody['cancel_info']["result_price"] ) { 문제 : order_uid : 59,60
        req.innerBody['cancel_info']["refund_payment"] = req.innerBody['cancel_info']["cancelable_price"];
    //     req.innerBody['cancel_info']["result_price"] = req.innerBody['cancel_info']["cancelable_price"];
        console.log("checkCancelablePayment 함수 로직 ")
        req = checkRefundReward(req);
    }else{
        req.innerBody['cancel_info']["refund_payment"] = req.innerBody['cancel_info']["result_price"];
    }



    return req;

}


function checkRefundReward(req) {

    const undefined_refund_price = req.innerBody['cancel_info']["result_price"] - req.innerBody['cancel_info']["cancelable_price"]


    if( undefined_refund_price >= req.innerBody['cancel_info']['cancelable_reward'] ) {
        req.innerBody['cancel_info']['refund_reward'] = req.innerBody['cancel_info']['cancelable_reward'];


        req.innerBody['cancel_info']['cancelable_point'] = undefined_refund_price - req.innerBody['cancel_info']['cancelable_reward'];
        req.innerBody['cancel_info']['cancelable_reward'] = 0;

        console.log("checkRefundReward 함수 로직 ")
    }
    else if ( undefined_refund_price < req.innerBody['cancel_info']['cancelable_reward'] ) {
        req.innerBody['cancel_info']['refund_reward'] = undefined_refund_price;
        req.innerBody['cancel_info']['cancelable_reward'] = undefined_refund_price;
    }


    return req;
}

function checkCancelableDelivery(req, _payment) {



    // 배달비 + 취소 금액
    if(req.innerBody['cancel_info']['order_product_count'] === 1) {
        console.log("checkCancelableDelivery 함수 로직")
        req.innerBody['cancel_info']['result_price'] += req.innerBody['cancel_info']['price_delivery']
    }

    console.log("rgerer");
    console.log("rgerer1: " + req.innerBody['cancel_info']['order_product_count']);
    console.log("rgerer2: " + req.innerBody['cancel_info']["result_price"]);


    // ex code
    // // 배달비 + 취소 금액
    // if(req.innerBody['cancel_info']['order_product_count'] === 1
    //    && req.innerBody['cancel_info']['use_point'] < req.innerBody['cancel_info']['price_delivery']) {
    //     req.innerBody['cancel_info']["cancelable_price"] >= _payment ?
    //         req.innerBody['cancel_info']['refund_payment'] += req.innerBody['cancel_info']['price_delivery'] :
    //         req.innerBody['cancel_info']['refund_reward'] += req.innerBody['cancel_info']['price_delivery']
    // }

    return req;
}

function checkCancelable(req) {
    const cancelable = req.innerBody['cancel_info']["cancelable_price"] + req.innerBody["cancel_info"]["cancelable_reward"] + req.innerBody["cancel_info"]["use_point"];

    return (cancelable >= req.innerBody['cancel_info']['refund_payment'])
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

function queryCancelablePrice(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_cancelable'
        , [
            req.paramBody['order_uid'],
            req.innerBody['cancel_info']['refund_payment'],
            req.innerBody['cancel_info']['refund_reward'],
            req.innerBody['cancel_info']['cancelable_point'],
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
            req.innerBody['cancel_info']['refund_reward'],
        ]

    );
}

function queryCancelInfo(req, db_connection){
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_cancel_info'
        , [
            parseInt(req.paramBody["status"]) === 0 ? 0 : 1,
            req.paramBody['order_uid'],
            req.paramBody['order_product_uid'],
        ]

    );
}


