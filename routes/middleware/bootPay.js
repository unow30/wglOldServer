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

            mysqlUtil.connectPool( async function (db_connection) {

                req.innerBody["cancelable"] = await query(req, db_connection);

                const extra_price =  req.paramBody['is_negligence'] ?  req.paramBody['extra_price'] : 0;

                if(!checkCancelable(req,extra_price) ) {
                    errUtil.createCall(errCode.fail, `반품하기 위한 취소 금액이 부족합니다.`);
                }

                let refund_price = req.paramBody['payment'] - extra_price;

                req.paramBody['refund_reward'] = req.innerBody['cancelable']['use_reward'];

                if( refund_price > req.innerBody['cancelable']["cancelable_price"] ) {
                    req.paramBody['refund_reward'] = refund_price - req.innerBody['cancelable']['cancelable_price'];
                    refund_price = req.innerBody['cancelable']["cancelable_price"];
                }


                await queryReward(req,db_connection)



                if(refund_price > 0) {
                    RestClient.setConfig(
                        process.env.BOOTPAY_APPLICATION_ID,
                        process.env.BOOTPAY_PRIVATE_KEY,
                    );


                    RestClient.getAccessToken().then(function (token) {
                        try {
                            if (token.status === 200) {
                                RestClient.cancel({
                                    receiptId: req.paramBody['pg_receipt_id'],
                                    price: refund_price,                               // "[[ 결제 취소할 금액 ]]"
                                    name: req.paramBody['nickname'],              // "[[ 취소자명 ]]"
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

function checkCancelable(req, extra_price) {
    const cancelable = req.innerBody['cancelable']["cancelable_price"] +  req.innerBody["cancelable"]["use_reward"];


    return ((cancelable >= req.paramBody['payment'] - extra_price ) || (req.paramBody['payment']  >= extra_price))
            ? true : false;
}

function querySelect(req, db_connection){
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_cancelable_price'
        , [
            req.paramBody['order_uid'],
        ]

    );
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
