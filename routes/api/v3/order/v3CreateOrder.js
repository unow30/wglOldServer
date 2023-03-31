const paramUtil = require('../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../common/utils/legacy/origin/logUtil');
const jwtUtil = require('../../../../common/utils/legacy/origin/jwtUtil');

const errCode = require('../../../../common/define/errCode');
const fcmUtil = require('../../../../common/utils/legacy/origin/fcmUtil');
const aligoUtil = require('../../../../common/utils/legacy/origin/aligoUtil');

const bootpayCrossVerificationUtil = require('../../../../common/utils/v3/bootpay/bootpayCrossVerificationUtil')

const axios = require('axios');
const {log} = require("debug");

axios.defaults.headers.common['Authorization'] = 'key=AAAAH1HxpKo:APA91bEGjPgOgXK2xZ-uqZHiR_PT69tO4knZt6ZCRpAXRESsnuY23MXWFneIQ-EALixYNkcUZg0iNczMW8eXc9ZLp6_dd1Kmz0t4rw5rJwboLwG-65hS0nyNps5OchEw72zP8dzlLNIa';
axios.defaults.headers.post['Content-Type'] = 'application/json';


let file_name = fileUtil.name(__filename);

//이대로 똑같이 가져다 쓰지 않을것
module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);
        // checkParam(req);
        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            //부트페이 결제완료 교차검증하고 결제승인하기.
            //결제승인이 되면 콜백함수 실행: db데이터 입력
            //payment_method 단건결제 결과에서 결제방식 확인 후 서버에서 보내야 한다.
            const calculateObj = await bootpayCrossVerificationUtil.paymentCompletedCrossVerification(req, res, 'common', db_connection)
            console.log('검증된 결제금액')
            console.log(calculateObj)

            const orderInfo = await createOrderDB(req, calculateObj, db_connection);
            if(!orderInfo){
                errUtil.createCall(errCode.fail, `상품구매에 실패하였습니다.`);
                return
            }
            req.innerBody['order_uid'] = orderInfo['order_uid']
            // req.innerBody['item'] = {order_uid: orderInfo['order_uid']}

            const createOrderProductList = await createOrderProductDB(req, calculateObj, db_connection);
            if(!createOrderProductList){
                errUtil.createCall(errCode.fail, `주문상품 db입력 실패?`)
                return
            }
            //각 상품의 판매자한테 주문알람 보내야 한다.
            await orderAlarm(req, res, createOrderProductList)

            if(req.paramBody['use_reward'] > 0 ) {
                await createRewardDB(req, orderInfo, db_connection);
            }
            if(req.paramBody['use_point'] > 0) {
                await createPointDB(req, orderInfo, db_connection);
            }

            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });

    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function checkParam(req) {
    paramUtil.checkParam_noReturn(req.paramBody, 'addressbook_uid');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['product']
}

async function createOrderDB(req, calculated, db_connection){
    let date = new Date();
    let unixTime = Math.floor(date.getTime() / 1000);

    const createOrderSql = `
    insert into tbl_order
    set user_uid = ${req.headers['user_uid']}
      , seller_uid = default
      , addressbook_uid = ${req.paramBody['addressbook_uid']}
      , order_no    = (${unixTime}*1000)+1
      , delivery_msg    = '${req.paramBody['delivery_msg']}'
      , seller_msg    = '${req.paramBody['seller_msg']}'
      , use_point    = ${calculated['totalPoint']}
      , use_reward    = ${calculated['totalReward']}
      , price_total    = ${calculated['priceTotal']}
      , delivery_total    = ${calculated['totalDelivery']}
      , price_payment    = ${calculated['totalPayment']}
      , pg_receipt_id   = '${calculated['pg_receipt_id']}'
      , cancelable_price = ${calculated['totalPayment']}
      , cancelable_point = ${calculated['totalPoint']}
      , cancelable_reward = ${calculated['totalReward']}
      , v_bank_account_number = ${null}
      , v_bank_expired_time = ${null}
      , v_bank_bank_name = ${null}
      , payment_method = ${req.paramBody['payment_method']}
    ;
    `
    return new Promise((resolve, reject) => {
         db_connection.query(createOrderSql, (err, res, fields) => {
             if (err) {
                 reject(err);
             } else {
                 const selectOrderData = `
                 select uid as order_uid
                     , _order.user_uid
                     , _order.order_no
                 from tbl_order as _order
                 where _order.uid = ${res['insertId']}
                 `;

                 db_connection.query(selectOrderData, (err, res, fields) => {
                     if(err){
                         reject(err);
                     }else{
                         resolve(res[0]);
                     }
                 })
             }
         })
    })
}

async function createOrderProductDB(req, calculateObj, db_connection) {
    return Promise.all(req.paramBody['product_list'].map(async (product_list) => {
        const {
            product_uid, seller_uid, video_uid, option_ids, count, price_original,
            payment, price_delivery
        } = product_list;

        // const order_uid = req.innerBody['item']['order_uid']
        const order_uid = req.innerBody['order_uid']

        const createOrderProductData = `
                insert into tbl_order_product
                set order_uid       = ${order_uid}
                , user_uid          = ${req.headers['user_uid']}
                , product_uid       = ${product_uid}
                , seller_uid        = ${seller_uid}
                , video_uid         = ${video_uid}
                , option_ids        = '${option_ids}'
                , count             = ${count}
                , price_original    = ${price_original}
                , payment           = ${payment}
                , price_delivery    = ${price_delivery}
                , product_name      = (select name from tbl_product where uid = ${product_uid})
                , product_image     = (select func_select_image_target(${product_uid}, 2))
                , option_names      = (select func_select_product_option_names(${product_uid}, '${option_ids}'))
                , status = default
            ;
            `;

        return await new Promise(async (resolve, reject) => {
            db_connection.query(createOrderProductData, (err, res, fields) => {
                if (err) {
                    reject(err);
                } else {
                    // retrieve the data of the inserted row
                    // const selectOrderProductData = `
                    //     SELECT uid, user_uid, order_uid, product_uid, seller_uid, video_uid
                    //     , option_ids, count, price_original, payment, price_delivery, option_names, product_name, product_image
                    //     FROM tbl_order_product
                    //     WHERE uid = ${res['insertId']}
                    // `;
                    const selectOrderProductData = `
                        select _seller.uid as seller_uid  
                            , _seller.nickname
                            , _seller.phone
                            , _seller.push_token
                            , _product.name as product_name
                        from tbl_order_product as _order_product
                            left outer join tbl_user as _seller
                                on _seller.uid = _order_product.seller_uid
                                and _seller.is_deleted = 0
                            left outer join tbl_product as _product
                                on _product.uid = _order_product.product_uid
                                and _product.is_deleted = 0
                        where _order_product.uid = ${res['insertId']};
                    `
                    db_connection.query(selectOrderProductData, (err, res, fields) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res[0]); // return the data of the inserted row
                        }
                    });
                }
            });
        });
    }));
}

async function createRewardDB(req, orderInfo, db_connection){
    const {user_uid, order_uid, order_no} = orderInfo;

    const createRewardSql = `
        insert into tbl_reward
        set user_uid       = ${req.headers['user_uid']}
      , seller_uid         = 0
      , order_uid          = ${order_uid}
      , order_no           = ${order_no}
      , state              = 2
      , amount             = ${req.paramBody['use_reward']}
      , content            = '상품 구매에 리워드 사용'
    `;

    // return new Promise((resolve, reject) => {
    //     db_connection.query(createRewardSql, (err, res, fields) => {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             const selectRewardSql = `
    //                 select r.uid as reward_uid
    //                 , r.order_uid
    //                 , r.order_no
    //                 , r.amount
    //                 , r.state
    //                 , r.content
    //                 from tbl_reward as r
    //                 where tbl_reward.uid = ${res['insertId']}
    //             `;
    //
    //             db_connection.query(selectRewardSql, (err, res, fields) =>{
    //                 if(err){
    //                     reject(err)
    //                 }else{
    //                     resolve(res[0]); // return the data of the inserted row
    //                 }
    //             });
    //         }
    //     });
    // });
    return new Promise((resolve, reject) => {
        db_connection.query(createRewardSql, (err, res, fields) => {
            if(err){
                reject(err);
            }else{
                resolve(true)
            }
        });
    });
}

function createPointDB(req, orderInfo, db_connection){
    const {user_uid, order_uid, order_no} = orderInfo;

    const createPointSql = `
        insert into tbl_point
        set user_uid       = ${req.headers['user_uid']}
        , order_no         = ${order_no}
        , type             = 2
        , amount           = ${req.paramBody['use_point'] * -1}
        , content          = '상품 구매에 포인트 사용'
    ;
    `;

    // return new Promise((resolve, reject) => {
    //     db_connection.query(createPointSql, (err, res, fields) => {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             const selectPointSql = `
    //                 select
    //                     *
    //                 from tbl_point as p
    //                 where p.uid = ${res['insertId']}
    //             `;
    //
    //             db_connection.query(selectPointSql, (err, res, fields) =>{
    //                 if(err){
    //                     reject(err)
    //                 }else{
    //                     resolve(res[0]); // return the data of the inserted row
    //                 }
    //             });
    //         }
    //     });
    // });
    return new Promise((resolve, reject) => {
        db_connection.query(createPointSql, (err, res, fields) => {
            if(err){
                reject(err);
            }else{
                resolve(true)
            }
        });
    });
}

async function orderAlarm(req, res, createOrderProductList) {
    let alrim_msg_distinc_list = createOrderProductList.reduce((prev, now) => {
        if (!prev.some(obj => obj.phone === now.phone)) prev.push(now);
        return prev;
    }, []);
    //중복제거는 해도 한 판매자에게 구매한 상품종류가 n개라면 외 n개라고 해주는게 좋겠다.
    console.log('alrim_msg_distinc_list중복제거', alrim_msg_distinc_list)

    // const push_token_list = [...new Set(createOrderProductList.map(list => list.push_token))];
    const push_token_list = alrim_msg_distinc_list.map(list => list.push_token);
    console.log('push_token_list중복제거', push_token_list)
    await fcmUtil.fcmCreateOrderList(push_token_list);//fcm알림도 중복제거가 되는가?

    req.body= {
        type: 's',
        time: '9999'
    }
    await aligoUtil.createToken(req, res);

    req.body= {
        senderkey: `${process.env.ALIGO_SENDERKEY}`,
        tpl_code: `TF_6863`,
        sender: `025580612`,
        subject_1: `상품 주문 알림(판매자)`,
    }

    let cnt = 1;
    for (let idx in alrim_msg_distinc_list) {
        idx = parseInt(idx);
        if(alrim_msg_distinc_list[idx]['phone'] && alrim_msg_distinc_list[idx]['phone'].length > 4) {
            req.body[`receiver_${cnt}`] = alrim_msg_distinc_list[idx]['phone']
            req.body[`message_${cnt}`] = setArimMessage(alrim_msg_distinc_list, idx)
            cnt++;
        }
    }
    await aligoUtil.alimSend(req, res);
}


function setArimMessage(alrim_msg_distinc_list, idx) {
    console.log("WOQIJCOEIWQJEOQWIEJO")
    return `상품 주문 알림

${alrim_msg_distinc_list[idx]['nickname']}님, 판매하시는 상품에 신규 주문이 들어왔습니다. 판매자 페이지에서 확인 부탁드립니다.

□ 주문상품 : ${alrim_msg_distinc_list[idx]['product_name']}`
}
