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
            await bootpayCrossVerificationUtil.PaymentCompletedCrossVerification(req, res, db_connection, function (calculatedObject) {
                //create order table
                console.log('tbl_order에 들어갈 데이터: ', calculatedObject);
                //create orderProduct table
                console.log('product_list 검증완료. 테이블 입력');
                //create reward table
                console.log('reward값 검증완료. 테이블 입력');
                //create point table
                console.log('point값 검증완료. 테이블 입력');
            });


            // console.log(data)

            // req.innerBody['item'] = await query(req, db_connection);

            // if (!req.innerBody['item']) {
            //     errUtil.createCall(errCode.fail, `상품구매에 실패하였습니다.`)
            //     return
            // }
            // if(req.innerBody['item']['payment_method'] === 3){
            //
            //     req.paramBody['status'] = 30 //가상계좌 입금대기상태
            // }
            //
            // req.innerBody['order_product_list'] = []
            // req.innerBody['push_token_list'] = []
            // req.innerBody['alrim_msg_list'] = []
            // for( let idx in req.paramBody['product_list'] ){
            //     req.innerBody['product'] = req.paramBody['product_list'][idx]
            //     let product = await queryProduct(req, db_connection)
            //
            //     req.innerBody['push_token_list'].push(product['push_token']);
            //     req.innerBody['order_product_list'].push( product );
            //
            //
            //     req.innerBody['alrim_msg_list'][idx] = {};
            //     req.innerBody['alrim_msg_list'][idx].phone = product['phone']
            //     req.innerBody['alrim_msg_list'][idx].name = product['name']
            //     req.innerBody['alrim_msg_list'][idx].nickname = product['nickname']
            // }
            //
            // if(req.innerBody['item']['payment_method'] !== 3){
            //     await alarm(req, res)
            // }else{
            //     delete req.innerBody['push_token_list']
            //     delete req.innerBody['alrim_msg_list']
            // }
            // // pushTokenFCM(push_token_list);
            //
            // if(req.paramBody['use_reward'] > 0 ) {
            //     req.innerBody['reward'] = await queryReward(req, db_connection);
            // }
            // if(req.paramBody['use_point'] > 0) {
            //     req.paramBody['use_point']
            //     req.innerBody['point'] = await queryPoint(req, db_connection);
            // }
            //
            // deleteBody(req)
            // sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
            res.send('ok')

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
    delete req.innerBody['product']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    let seller_uid = 0
    try {
        seller_uid = req.paramBody['product_list'][0]['seller_uid']
    }
    catch (e){ }

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_order'
        , [
            req.headers['user_uid'],
            seller_uid,
            req.paramBody['addressbook_uid'],
            req.paramBody['delivery_msg'],
            req.paramBody['seller_msg'],
            req.paramBody['use_point'],
            req.paramBody['use_reward'],
            req.paramBody['price_total'],
            req.paramBody['delivery_total'],
            req.paramBody['price_payment'],
            req.paramBody['pg_receipt_id'],
            req.paramBody['v_bank_account_number'],
            req.paramBody['v_bank_expired_time'],
            req.paramBody['v_bank_bank_name'],
            req.paramBody['payment_method'],
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
