/**
 * Created by hyunhunhwang on 2021. 02. 10.
 *
 * @swagger
 * /api/private/v3/order:
 *   post:
 *     summary: 상품 구매 v3
 *     tags: [Order]
 *     description: |
 *       path : /api/private/v3/order
 *
 *       * 상품 구매 v3
 *       * 서버에서 결제내역 검증 후 승인
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           상품 구매
 *
 *           payment_method
 *           * 0: 신용카드
 *           * 1: 카카오페이
 *           * 2: 무통장입금
 *           * 3: 가상계좌
 *           * 4: 네이버페이
 *         schema:
 *           type: object
 *           required:
 *             - addressbook_uid
 *             - payment_method
 *           properties:
 *             addressbook_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 배송지 주소 uid
 *             delivery_msg:
 *               type: string
 *               example: 집 문앞에 놔주세요
 *               description: |
 *                 배송메모
 *             seller_msg:
 *               type: string
 *               example: 잘 보내주세요
 *               description: |
 *                 판매자에게 메세지
 *             use_point:
 *               type: number
 *               example: 0
 *               description: |
 *                 포인트 사용 금액
 *                 * 사용 안할 경우 0
 *             use_reward:
 *               type: number
 *               example: 0
 *               description: |
 *                 리워드 사용 금액
 *                 * 사용 안할 경우 0
 *             pg_receipt_id:
 *               type: string
 *               example: 611b3e5e7b5ba40025b0cc99
 *               description: |
 *                 PG사 결제 완료 값 id
 *             payment_method:
 *               type: number
 *               example: 0
 *               description: |
 *                 결제 방법
 *                 * 0: 신용카드
 *                 * 1: 카카오페이
 *                 * 2: 무통장입금
 *                 * 3: 가상계좌
 *                 * 4: 네이버페이
 *             product_list:
 *               type: array
 *               description: 구매 상품 목록
 *               items:
 *                 type: object
 *                 properties:
 *                   product_uid:
 *                     type: number
 *                     example: 100053
 *                     description: 구매 상품 uid
 *                   seller_uid:
 *                     type: number
 *                     example: 224
 *                     description: |
 *                       판매자 uid
 *                   video_uid:
 *                     type: number
 *                     example: 1
 *                     description: |
 *                       리뷰어 영상 uid
 *                       * 리뷰어가 없을 경우 0으로 보내면 됩니다.
 *                   option_ids:
 *                     type: string
 *                     example: '101'
 *                     description: |
 *                       옵션 option_id 목록
 *                       * ','로 구분
 *                   count:
 *                     type: number
 *                     example: 2
 *                     description: |
 *                       구매 갯수
 *                       * 최소 1개 이상
 *                   price_original:
 *                     type: number
 *                     example: 25000
 *                     description: 상품 1개당 판매가(tbl_order_product의 price_original)
 *                   payment:
 *                     type: number
 *                     example: 50000
 *                     description: |
 *                       해당 상품 구매 금액
 *                       * price_discount * count
 *                   price_delivery:
 *                     type: number
 *                     example: 2000
 *                     description: |
 *                       판매자 배송비
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

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
        // logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);

        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        // checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            //부트페이 결제완료 교차검증하고 결제승인하기.
            //결제승인이 되면 콜백함수 실행: db데이터 입력
            //payment_method 단건결제 결과에서 결제방식 확인 후 서버에서 보내야 한다.
            const calculateObj = await bootpayCrossVerificationUtil.PaymentCompletedCrossVerification(req, res, db_connection)
            console.log('검증된 결제금액')
            console.log(calculateObj)

            const createOrderInfo = await createOrderDB(req, calculateObj, db_connection)
            if(!createOrderInfo){
                errUtil.createCall(errCode.fail, `상품구매에 실패하였습니다.`)
                return
            }
            req.innerBody['order_uid'] = createOrderInfo

            const createOrderProductList = createOrderProductDB(req, calculateObj, db_connection)
            console.log('order_product 입력', createOrderProductList)
            if(!createOrderProductList){
                errUtil.createCall(errCode.fail, `주문상품 db입력 실패?`)
                return
            }
            //각 상품의 판매자한테 주문알람 보내야 한다.

            if(req.paramBody['use_reward'] > 0 ) {
                req.innerBody['reward'] = await queryReward(req, db_connection);
            }
            if(req.paramBody['use_point'] > 0) {
                req.innerBody['point'] = await queryPoint(req, db_connection);
            }

            console.log('req.innerBody 데이터 확인 후 sendUtil.sendSuccessPacket(req, res, req.innerBody, true); 실행')



            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
            // res.send('ok')

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
    paramUtil.checkParam_noReturn(req.paramBody, 'price_total');
    paramUtil.checkParam_noReturn(req.paramBody, 'delivery_total');
    paramUtil.checkParam_noReturn(req.paramBody, 'price_payment');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['product']
}

async function createOrderDB(req, calculated, db_connection){
    let date = new Date();
    let unixTime = Math.floor(date.getTime() / 1000);

    const createOrderData = `
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
         db_connection.query(createOrderData, (err, res, fields) => {
             console.log('order res',res)
             if (err) {
                 reject(err);
             } else {
                 resolve(res['insertId']);
             }
         })
    })
}

function createOrderProductDB(req, calculateObj, db_connection){

    return Promise.all(req.paramBody['product_list'].map(async (product_list) =>{
        const {
            product_uid, seller_uid, video_uid, option_ids, count, price_original,
            payment, price_delivery
        } = product_list

        return await new Promise( async(resolve, reject) => {
            const createOrderProductData = `
            insert into tbl_order_product
            set order_uid = ${req.innerBody['order_uid']}
          , user_uid = ${req.headers['user_uid']}
          , product_uid    = ${product_uid}
          , seller_uid    = ${seller_uid}
          , video_uid    = ${video_uid}
          , option_ids    = '${option_ids}'
          , count    = ${count}
          , price_original    = ${price_original}
          , payment    = ${payment}
          , price_delivery = ${price_delivery}
          , product_name = (select name from tbl_product where uid = ${product_uid})
          , product_image = (select func_select_image_target(${product_uid}, 2))
          , option_names = (select func_select_product_option_names(${product_uid}, '${option_ids}'))
          , status = default
        ;
        `
        db_connection.query(createOrderProductData, (err, res, fields) => {
            console.log('createOrderProductData',createOrderProductData)
            console.log('order_product res',res)
                if (err) {
                    reject(err);
                } else {
                    resolve(res['insertId']);
                }
            });
        })
    }));
}

function createRewardDB(){

}

function createPointDB(){

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
function queryProduct(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_order_product'
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
            req.paramBody['status'],
        ]
    );
}

async function alarm(req, res) {

    const push_token_list = Array.from(new Set(req.innerBody['push_token_list']))
    await fcmUtil.fcmCreateOrderList(push_token_list);


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

    let alrim_msg_distinc_list = req.innerBody['alrim_msg_list'].reduce((prev, now) => {
        if (!prev.some(obj => obj.phone === now.phone)) prev.push(now);
        return prev;
    }, []);


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

□ 주문상품 : ${alrim_msg_distinc_list[idx]['name']}`
}
