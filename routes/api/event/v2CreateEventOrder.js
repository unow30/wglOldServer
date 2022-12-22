/**
 * Created by yunhokim on 2022. 12. 12.
 *
 * @swagger
 * /api/private/v2/event/order:
 *   post:
 *     summary: 이벤트 상품 구매
 *     tags: [Event]
 *     description: |
 *       path : /api/private/v2/event/order
 *
 *       * ## 이벤트 상품 구매
 *       * ### /api/private/v2/event/check 실행 결과값을 포함한다.
 *       * ### 당첨자 결제비용 안들어간다. 부트페이 로직 없음
 *       * ### (상품가격+옵션가격+수량) + 배송비의 합을 저장한다. 기존 방식과 동일
 *       * ### 결제타입을 6: 이벤트 결제내역이라고 만들고 위글에서 대금을 지불한다.
 *       * ### 옵션 id를 101로 고정한다. 이번에는 상품 옵션을 여러가지 고려안해도 된다.
 *       * ### order_product가 전부 추가되었다면 code값이 일치하는 event의 코드사용여부를 사용함으로 변경한다.
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           상품 구매
 *
 *           payment_method
 *           * 6: 이벤트상품 증정
 *         schema:
 *           type: object
 *           required:
 *             - addressbook_uid
 *             - payment_method
 *           properties:
 *             event_code:
 *               type: string
 *               example: aaa
 *               description: |
 *                 이벤트 코드
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
 *             payment_method:
 *               type: number
 *               example: 6
 *               description: |
 *                 결제 방법
 *                 * 0: 신용카드
 *                 * 1: 카카오페이
 *                 * 2: 무통장입금
 *                 * 3: 가상계좌
 *                 * 4: 네이버페이
 *                 * 5: 포인트/리워드 결제
 *                 * 6: 이벤트상품 증정
 *             product_list:
 *               type: array
 *               description: 구매 상품 목록
 *               items:
 *                 type: object
 *                 properties:
 *                   product_uid:
 *                     type: number
 *                     example: 1
 *                     description: 구매 상품 uid
 *                   seller_uid:
 *                     type: number
 *                     example: 1
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
 *                     example: 12000
 *                     description: 상품 1개당 원가. 실제 결제되는 가격을 계산해야 한다.(product의 discount_price가 실제 결제되는 가격이다.)
 *                   payment:
 *                     type: number
 *                     example: 24000
 *                     description: |
 *                       해당 상품 구매 금액
 *                       * price_original * count
 *                   price_delivery:
 *                     type: number
 *                     example: 0
 *                     description: |
 *                       판매자 배송비
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const paramUtil = require('../../../common/utils/paramUtil');
const fileUtil = require('../../../common/utils/fileUtil');
const mysqlUtil = require('../../../common/utils/mysqlUtil');
const sendUtil = require('../../../common/utils/sendUtil');
const errUtil = require('../../../common/utils/errUtil');
const logUtil = require('../../../common/utils/logUtil');
const jwtUtil = require('../../../common/utils/jwtUtil');
const dateUtil = require('../../../common/utils/dateUtil')

const errCode = require('../../../common/define/errCode');
const fcmUtil = require('../../../common/utils/fcmUtil');
const aligoUtil = require('../../../common/utils/aligoUtil');

const axios = require('axios');
const {log} = require("debug");

axios.defaults.headers.common['Authorization'] = 'key=AAAAH1HxpKo:APA91bEGjPgOgXK2xZ-uqZHiR_PT69tO4knZt6ZCRpAXRESsnuY23MXWFneIQ-EALixYNkcUZg0iNczMW8eXc9ZLp6_dd1Kmz0t4rw5rJwboLwG-65hS0nyNps5OchEw72zP8dzlLNIa';
axios.defaults.headers.post['Content-Type'] = 'application/json';


let file_name = fileUtil.name(__filename);

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

            //이벤트코드 불일치, 사용한 이벤트 코드일 경우 이 로직과 뷰화면이 나타날 수 없다.
            //그래도 안전을 위해 필터링을 다시 진행한다.
            let event_data = await queryEventUser(req, db_connection);
            if(!event_data || event_data.length === 0){
                errUtil.createCall(errCode.err,'잘못된 이벤트 코드입력 입니다.')
            }

            const {year, month, date} = dateUtil()
            const today = new Date(`${year}-${month}-${date}`)
            event_data.forEach(el=>{
                if(el['is_checked'] === 1){
                    errUtil.createCall(errCode.err,'이미 사용된 이벤트 코드입니다.')
                }

                let endTime = new Date(el['end_time'])
                // console.log(year, month, date)
                // console.log(today)
                // console.log(endTime)
                if(today >= endTime){
                    errUtil.createCall(errCode.err, '입력기한이 초과된 이벤트 코드입니다.')
                }

                if(el['is_deleted'] === 1 || el['is_authorize'] === 0){
                    errUtil.createCall(errCode.err, `${el['name']}상품이 준비중입니다.`)
                }
            })
            //이벤트 필터링 종료

            //이벤트 코드 사용체크 업데이트
            let event_update = await queryEventUpdate(req, db_connection)
            // console.log(event_check['event_code'])
            // console.log(req.paramBody['event_code'])

            if(event_update['event_code'] !== req.paramBody['event_code']){
                errUtil.createCall(errCode.fail, `이벤트 코드가 정확하지 않습니다. 다시 입력해주세요`)
            }
            //이벤트 코드 사용체크 업데이트 종료

            //계산로직이 돌아간 다음 item안에 값이 들어가야 한다.
            let calc = {"price_total": 0, "delivery_total": 0, "price_payment":0, "other_seller": 0}
            req.paramBody['product_list'].forEach(el=>{
                calc['price_total'] += (Number(el['price_original']) * Number(el['count']))
                if(calc['other_seller'] !==  el['seller_uid']){
                    calc['delivery_total'] += Number(el['price_delivery'])
                    calc['other_seller'] = el['seller_uid']
                }
            })
            calc['price_payment'] = Number(calc['price_total']) + Number(calc['delivery_total'])
            //종료

            //order테이블 먼저 업로드
            req.innerBody['item'] = await query(req, db_connection, calc);

            if (!req.innerBody['item']) {
                errUtil.createCall(errCode.fail, `상품구매에 실패하였습니다.`)
                return
            }
            //종료

            // if(req.innerBody['item']['payment_method'] === 3){
            //
            //     req.paramBody['status'] = 30 //가상계좌 입금대기상태
            // }

            req.innerBody['order_product_list'] = []
            req.innerBody['push_token_list'] = []
            req.innerBody['alrim_msg_list'] = []
            //order_product테이블 업데이트
            for( let idx in req.paramBody['product_list'] ){
                req.innerBody['product'] = req.paramBody['product_list'][idx]
                let product = await queryProduct(req, db_connection)

                req.innerBody['push_token_list'].push(product['push_token']);
                req.innerBody['order_product_list'].push( product );


                req.innerBody['alrim_msg_list'][idx] = {};
                req.innerBody['alrim_msg_list'][idx].phone = product['phone']
                req.innerBody['alrim_msg_list'][idx].name = product['name']
                req.innerBody['alrim_msg_list'][idx].nickname = product['nickname']
            }
            //종정

            if(req.innerBody['item']['payment_method'] !== 3){
                await alarm(req, res)
            }else{
                delete req.innerBody['push_token_list']
                delete req.innerBody['alrim_msg_list']
            }
            // pushTokenFCM(push_token_list);

            // if(req.paramBody['use_reward'] > 0 ) {
            //     req.innerBody['reward'] = await queryReward(req, db_connection);
            // }
            // if(req.paramBody['use_point'] > 0) {
            //     req.paramBody['use_point']
            //     req.innerBody['point'] = await queryPoint(req, db_connection);
            // }

            deleteBody(req)

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
    // paramUtil.checkParam_noReturn(req.paramBody, 'price_total');
    // paramUtil.checkParam_noReturn(req.paramBody, 'delivery_total');
    // paramUtil.checkParam_noReturn(req.paramBody, 'price_payment');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    delete req.innerBody['product']
}

function query(req, db_connection, calc) {
    const _funcName = arguments.callee.name;

    let seller_uid = 0
    // try {
    //     seller_uid = req.paramBody['product_list'][0]['seller_uid']
    // }
    // catch (e){ }
    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_order'
        , [
            req.headers['user_uid'],
            seller_uid,
            req.paramBody['addressbook_uid'],
            req.paramBody['delivery_msg'],
            '',//req.paramBody['seller_msg'],
            0,//req.paramBody['use_point'],
            0,//req.paramBody['use_reward'],
            calc['price_total'],
            calc['delivery_total'],
            calc['price_payment'],
            '',//req.paramBody['pg_receipt_id'],
            '',//req.paramBody['v_bank_account_number'],
            '',//req.paramBody['v_bank_expired_time'],
            '',//req.paramBody['v_bank_bank_name'],
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
    //order_product 하나씩 생성될때마다 event테이블의 받기를 업데이트한다? 아니면 동시에 업데이트한다?
    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_order_product_for_event_v2'
        , [
            req.headers['user_uid'],
            req.innerBody['item']['uid'],
            req.innerBody['product']['product_uid'],
            req.innerBody['product']['seller_uid'],
            req.innerBody['product']['video_uid'],
            req.innerBody['product']['option_ids'], //101로 고정하면 프로시저에서 못찾는다.
            req.innerBody['product']['count'],
            req.innerBody['product']['price_original'],
            req.innerBody['product']['payment'],
            req.innerBody['product']['price_delivery'],
            req.paramBody['status'],
        ]
    );
}

function queryEventUpdate(req, db_connection){
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_event_check_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['event_code']
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
    return `상품 주문 알림

${alrim_msg_distinc_list[idx]['nickname']}님, 판매하시는 상품에 신규 주문이 들어왔습니다. 판매자 페이지에서 확인 부탁드립니다.

□ 주문상품 : ${alrim_msg_distinc_list[idx]['name']}`
}


function queryEventUser(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_event_user_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['event_code'],
        ]
    );
}