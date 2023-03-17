/**
 * Created by gunucklee on 2021. 07. 22.
 */

const paramUtil = require('../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../common/utils/legacy/origin/logUtil');

const errCode = require('../../../../common/define/errCode');

const RestClient = require('@bootpay/server-rest-client').RestClient;

/**
 * [‘cancel_info’][‘cancelable_price’]: 전체주문에서 구매자가 환불받을 수 있는 금액
 * [‘cancel_info’][‘cancelable_reward’]: 전체주문에서 구매자가 환불받을 수 있는 리워드
 * [‘cancel_info’][‘cancelable_point’]: 전체주문에서 구매자가 환불받을 수 있는 포인트(포인트는 환불,교환 시 환불되지 않는다. 표시만 될뿐)
 * [‘cancel_info’][‘use_point’]: 구매자가 사용한 포인트. cancelable_point와 다를 수 있다.(취소,반품,교환시 포인트는 사라진다.)
 *
 * [‘cancel_info’][‘price_delivery’]: 구매한 상품 하나의 배송비
 * [‘cancel_info’][‘order_product_count’]: 전제주문에서 구매한 상품의 개수
 *
 * [‘cancel_info’][‘refund_payment’]: 결제내역 변경으로 환불해야할 결제금액
 * [‘cancel_info’][‘refund_reward’]: 결제내역 변경으로 환불해야할 리워드 금액
 * [‘cancel_info’][‘result_price’]: 구매 취소할 상품 하나의 금액. 주문상품개수가 1개일 경우에는 배송비도 포함한다.
 * undefined_refund_price: 미정된 환불 금액. 전체 주문 금액에서 리워드, 포인트, 배송비가 더해져있다.
 *
 */
module.exports =  function (req, res, next) {
    req.paramBody = paramUtil.parse(req);

    try {
        /**
        * req.paramBody["status"]) === 6은 상품취소를 요청하기 위해 전달하는 값
        * req.paramBody["status"]) === 0은 선물 결제완료를 취소(6으로 변경)하기 위해 확인하는 값
        * 둘 다 order_product.status를 확인한다.
        */
        if (parseInt(req.paramBody["status"]) === 6 || parseInt(req.paramBody["status"]) === 0 || parseInt(req.paramBody["status"]) === 51) {


            mysqlUtil.connectPool( async function (db_connection) {
                req.innerBody = {};
                /**
                * queryCancelInfo에서 취소하는 상품 1개의 정보, 같이 구매한 상품 개수, 판매자 수를 가져온다.
                * 상품 하나의 환불 가격 req.innerBody['cancel_info']['refund_payment']이 ['result_price']가 된다.
                */
                req.innerBody['cancel_info'] = await queryCancelInfo(req, db_connection);
                req.innerBody['cancel_info']['result_price'] = req.innerBody['cancel_info']['refund_payment'];

                // const _payment = req.innerBody['cancel_info']['refund_payment'];
                /**
                * 'order_product_count'가 1개라면 취소할 상품금액['result_price']에 배송비도 포함한다.
                */
                req = checkCancelableDelivery(req, req.innerBody['cancel_info']['refund_payment']);

                // ex code
                /**
                * 'cancelable_price'확인
                * 'cancelable_reward'확인
                */
                req = checkCancelablePayment(req);

                console.log("gwegaewhgwo");
                console.log("gwegaewhgwo1: " + req.innerBody['cancel_info']["cancelable_point"]);
                console.log("gwegaewhgwo2: " + req.innerBody['cancel_info']["result_price"]);
                //리뷰어 리워드 환불진행
                req.innerBody['bootpay_info'] = await queryReward(req,db_connection)

                if(req.innerBody['cancel_info']['refund_payment'] > 0 || req.innerBody['cancel_info']['refund_reward'] > 0 || req.innerBody['cancel_info']['cancelable_point'] > 0)
                    //환불금액, 환불리워드, 취소가능금액이 있다면 취소진행
                    await queryCancelablePrice(req, db_connection);

                //부트패이로 취소 진행
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

    console.log("********************************");
    console.log("전체 취소가능 금액: " + req.innerBody['cancel_info']["cancelable_price"]);
    console.log("취소할 상품금액: " + req.innerBody['cancel_info']["result_price"]);
    console.log("********************************");
    //
    //취소할 상품금액에는 구매자 결제금액과 배송비가 들어있고 이 값을 환불해줘야 한다.
    //전체 취소가능 금액이 최종적으로 환불해야할 금액이 된다.
    //그다음 최종적으로 환불해야 할 리워드 금액이 있는지 확인한다.
    /**
     * 'cancelable_price'보다 'result_price'가 크거나 같다면 'cancelable_price'가 최종 환불할 결제금액이 된다.
     * 'result_price'가 상품가격+배송비일 경우, 'result_price'와 'cancelable_price'가 금액이 일치하는 경우가 있다.
     * */
    if( req.innerBody['cancel_info']["cancelable_price"]  <= req.innerBody['cancel_info']["result_price"] ) {
    // if( req.innerBody['cancel_info']["cancelable_price"]  < req.innerBody['cancel_info']["result_price"] ) { 문제 : order_uid : 59,60
        req.innerBody['cancel_info']["refund_payment"] = req.innerBody['cancel_info']["cancelable_price"];
    //     req.innerBody['cancel_info']["result_price"] = req.innerBody['cancel_info']["cancelable_price"];
        console.log("checkCancelablePayment 함수 로직 ")
        req = checkRefundReward(req);

    /**
     * 'cancelable_price'이 'result_price'보다 크다면 'result_price'가 'refund_payment'가 된다
     * 이후 로직에서 'cancelable_price'이 'result_price'금액만큼 차감된다.
     * 취소과정이 진행되면 포인트는 돌려주지 않는다. 'cancelable_point'를 0원으로 한다.
     * */
    }else{
        req.innerBody['cancel_info']["refund_payment"] = req.innerBody['cancel_info']["result_price"];
        req.innerBody['cancel_info']["cancelable_point"] = 0;
    }



    return req;

}


function checkRefundReward(req) {
    /**
     * 'result_price'에 'cancelable_price'을 차감하고 남는 금액이 있다면
     * 'undefined_refund_price'에는 구매자가 상품을 구매하기 위해 사용한 리워드, 포인트 등이 들어있을 것이다.
     *
     * */
    const undefined_refund_price = req.innerBody['cancel_info']["result_price"] - req.innerBody['cancel_info']["cancelable_price"]

    /**
     * 'undefined_refund_price'가 'cancelable_reward'보다 크거나 같다면
     * 'cancelable_reward'가 최종적으로 환불해줄 reward가 된다.
     * */
    if( undefined_refund_price >= req.innerBody['cancel_info']['cancelable_reward'] ) {
        req.innerBody['cancel_info']['refund_reward'] = req.innerBody['cancel_info']['cancelable_reward'];

        /**
         * 'undefined_refund_price'에서 'cancelable_reward'를 차감한 값이 cancelable_point가 된다.
         * 'cancelable_reward'가 전체 환불되므로 0원으로 바꾼다.
         * */
        req.innerBody['cancel_info']['cancelable_point'] = undefined_refund_price - req.innerBody['cancel_info']['cancelable_reward'];
        req.innerBody['cancel_info']['cancelable_reward'] = 0;

        console.log("checkRefundReward 함수 로직 ")
    }
    /**
     * 'undefined_refund_price'가 'cancelable_reward'보다 작다면
     * 'undefined_refund_price'가 최종적으로 환불해줄 reward가 된다.
     * */
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


