/**
 * Created by yunhokim on 2022. 07. 26.
 *
 * @swagger
 * /api/private/v1/groupbuying/order:
 *   post:
 *     summary: 공구 상품 구매
 *     tags: [GroupBuying]
 *     description: |
 *      ## path : /api/private/v1/groupbuying/order
 *
 *       * ## 공동구매 상품 구매
 *       * ## 포인트 사용 x
 *       * ## 배송비 0원
 *       * ## 무통장입금, 가상계좌 결제 불가
 *       * ## video_uid = 0 -> 공구상품 리뷰 업로드 불가(일반상품 가능)
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           공동구매 상품 구매
 *
 *           payment_method
 *           * 0: 신용카드
 *           * 1: 카카오페이
 *           * 4: 네이버페이
 *
 *           groupbuying_room_uid
 *           * 공구방 '생성'시에는 0으로 한다.
 *           * 공구방 '참가'시에는 참가할 공구방 uid 입력
 *
 *           recruitment
 *           * 공구방 '생성'시 참여가능한 인원수를 입력한다(2,5,10)
 *           * 공구방 '참가'시 참여가능 인원수를 받지 않아도 된다(0으로 줘도 됨)
 *
 *           use_point
 *           * 포인트는 사용 못하니 0으로 전달
 *
 *           quantity
 *           * 구매 수량(최대 10개)
 *           * product_list의 count와 같다.
 *         schema:
 *           type: object
 *           required:
 *             - addressbook_uid
 *             - price_total
 *             - delivery_total
 *             - price_payment
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
 *             price_total:
 *               type: number
 *               example: 50000
 *               description: |
 *                 총 상품 금액
 *             delivery_total:
 *               type: number
 *               example: 0
 *               description: |
 *                 주문 배송비 총합
 *                 * 배송비가 없을 경우 0
 *             price_payment:
 *               type: number
 *               example: 50000
 *               description: |
 *                 결제 금액
 *             pg_receipt_id:
 *               type: string
 *               example: 5fffad430c20b903e88a2d17
 *               description: |
 *                 PG사 결제 완료 값 id
 *             payment_method:
 *               type: number
 *               example: 1
 *               description: |
 *                 결제 방법
 *                 * 0: 신용카드
 *                 * 1: 카카오페이
 *                 * 4: 네이버페이
 *             groupbuying_uid:
 *               type: number
 *               example: 15
 *               description: |
 *                 공구 uid
 *             groupbuying_room_uid:
 *               type: number
 *               example: 8
 *               description: |
 *                 공구 방 uid(방을 생성할 경우 0으로 전달)
 *             recruitment:
 *               type: number
 *               example: 2
 *               description: |
 *                 모집인원(2,5,10)
 *             groupbuying_option_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 공구 옵션 uid
 *             quantity:
 *               type: number
 *               example: 1
 *               description: |
 *                 공구 구매 수량(최대 10개)
 *             product_list:
 *               type: array
 *               description: 구매 상품 목록
 *               items:
 *                 type: object
 *                 properties:
 *                   product_uid:
 *                     type: number
 *                     example: 3
 *                     description: 구매 상품 uid
 *                   seller_uid:
 *                     type: number
 *                     example: 2
 *                     description: |
 *                       판매자 uid
 *                   video_uid:
 *                     type: number
 *                     example: 0
 *                     description: |
 *                       리뷰어 영상 uid
 *                       * 리뷰어가 없을 경우 0으로 보내면 됩니다.
 *                   count:
 *                     type: number
 *                     example: 1
 *                     description: |
 *                       구매 갯수
 *                       * 최소 1개 이상
 *                   price_original:
 *                     type: number
 *                     example: 50000
 *                     description: 상품 1개당 원가
 *                   payment:
 *                     type: number
 *                     example: 50000
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
 *       200:
 *         description: 결과 정보
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

            req.innerBody['order_product_list'] = []
            req.innerBody['push_token_list'] = []
            req.innerBody['alrim_msg_list'] = []
            req.innerBody['product'] = req.paramBody['product_list'][0]


            // 공구방 uid가 없으면 공구방 생성, 공구방유저 생성을 한다.
            // console.log('공구방 uid는?')
            // console.log(req.paramBody['groupbuying_room_uid'])
            if(req.paramBody['groupbuying_room_uid'] == 0){
                console.log('공구방 생성 공구방 유저 생성 시작')
                let groupbuyingRoom = await queryCreateGroupBuyingRoom(req, db_connection);
                req.paramBody['groupbuying_room_uid'] = groupbuyingRoom['uid']

                console.log('order 생성 시작')
                req.innerBody['item'] = await queryOrder(req, db_connection);
                if (!req.innerBody['item']) {
                    errUtil.createCall(errCode.fail, `상품구매에 실패하였습니다.`)
                    return
                }
                //공구 주문상품 테이블 생성
                //판매자 푸시토큰 생성,카카오 알람 메시지 생성은 같은 함수에서 실행하자
                console.log('order_product 생성 시작')
                let product = await queryProduct(req, db_connection);
                req.innerBody['order_product_list'].push( product );
                // console.log('pushtoken aligo 변수 생성 시작') => 방을 생성해 혼자있는데 알리고 매칭, 판매자 알림을 할수 없다.
                makePushTokenAndAligoParam(req, product)

            }else{
                // 공구방 uid가 있으면 공구방 업데이트, 공구방 유저 생성을 한다.
                console.log('공구방 이미 생성됨. 업데이트 및 공구방 유저 생성 시작')
                let roomIsFull = await queryCreateGroupBuyingRoomUser(req, db_connection);

                console.log('order 생성 시작')
                req.innerBody['item'] = await queryOrder(req, db_connection);
                if (!req.innerBody['item']) {
                    errUtil.createCall(errCode.fail, `상품구매에 실패하였습니다.`)
                    return
                }
                //공구 주문상품 테이블 생성
                //판매자 푸시토큰 생성,카카오 알람 메시지 생성은 같은 함수에서 실행하자
                console.log('order_product 생성 시작')
                let product = await queryProduct(req, db_connection);
                req.innerBody['order_product_list'].push( product );
                console.log('pushtoken aligo 변수 생성 시작')
                // makePushTokenAndAligoParam(req, product)

                //공구방이 풀로 찰 경우 매칭알림(?), 구매알림 보내야한다.
                console.log(roomIsFull)
                if(roomIsFull['status'] == 1){
                    //같은 방에있는 주문상품의 status 50을 1로 바꿔줘야 한다.
                    await queryUpdateOrderProduct(req, db_connection);
                    const pushList = await queryGonguRoomUser(req, db_connection);
                    console.log('매칭알람 보내기 pushList', pushList)
                    await orderMatchAlarm(pushList);
                    console.log('판매자 주문알람 보내기')
                    await orderAlarm(req, res)
                }
            }


            console.log('공구옵션 수량 업데이트 및 공구 솔드아웃 여부 확인')
            // 공구옵션값을 업데이트한다. sales_quantity와 soldout을 같이 업데이트해준다.
            let option_soldout_list = await queryUpdateGroupBuyingOption(req, db_connection);

            console.log(option_soldout_list)//[]로 날라오니 이부분 수정해서 공구 솔드아웃 안되도록 하기
            let isAllSoldout = option_soldout_list.every(function(el, idx, arr){
                return el['soldout'] == 1//soldout = 1이면 옵션상품 품절
            }) //true, falses
            console.log('옵션 전부 솔드아웃이닝')
            console.log(isAllSoldout)
            if(isAllSoldout == true){
                // 공구상품을 업데이트한다. 모든 옵션이 품절이면 공구 soldout을 1로 한다.
                let updateGroupbuying = await queryUpdateGroupBuying_soldout(req, db_connection);
                //(공구 솔드아웃) 알람하기
                console.log(updateGroupbuying)
            }

            if(req.paramBody['use_reward'] > 0 ) {
                req.innerBody['reward'] = await queryReward(req, db_connection);
            }
            // if(req.paramBody['use_point'] > 0) {
            //     req.paramBody['use_point']
            //     req.innerBody['point'] = await queryPoint(req, db_connection);
            // }

            console.log(req.innerBody['product']['product_uid'])
            req.innerBody['kakao_link'] = await queryKakaoLink(req,db_connection);

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
    paramUtil.checkParam_noReturn(req.paramBody, 'price_total');
    paramUtil.checkParam_noReturn(req.paramBody, 'delivery_total');
    paramUtil.checkParam_noReturn(req.paramBody, 'price_payment');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    delete req.innerBody['product']
    delete req.innerBody['push_token_list']
    delete req.innerBody['alrim_msg_list']
}

async function createAndUpdateOrderProduct(req, db_connection){
    let product = await queryProduct(req, db_connection, 1)
    req.innerBody['push_token_list'].push(product['push_token']);
    req.innerBody['order_product_list'].push( product );

    req.innerBody['alrim_msg_list'][0] = {};
    req.innerBody['alrim_msg_list'][0].phone = product['phone']
    req.innerBody['alrim_msg_list'][0].name = product['name']
    req.innerBody['alrim_msg_list'][0].nickname = product['nickname']

}

function queryOrder(req, db_connection) {
    const _funcName = arguments.callee.name;

    // let seller_uid = 0
    // try {
    //     seller_uid = req.paramBody['product_list'][0]['seller_uid']
    // }
    // catch (e){ }

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_order_for_groupbuying_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['addressbook_uid'],
            req.paramBody['delivery_msg'],
            req.paramBody['seller_msg'],
            req.paramBody['use_point'],
            req.paramBody['use_reward'],
            req.paramBody['price_total'],
            req.paramBody['delivery_total'],
            req.paramBody['price_payment'],
            req.paramBody['pg_receipt_id'],
            '',
            null,
            '',
            req.paramBody['payment_method'],
            req.paramBody['groupbuying_room_uid']
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

function queryProduct(req, db_connection, status) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_order_product_for_groupbuying_v1'
        , [
            req.headers['user_uid'],
            req.innerBody['item']['uid'],
            req.innerBody['product']['product_uid'],
            req.innerBody['product']['seller_uid'],
            req.innerBody['product']['video_uid'],
            req.innerBody['product']['count'],
            req.innerBody['product']['price_original'],
            req.innerBody['product']['payment'],
            req.innerBody['product']['price_delivery'],
            50, //공구주문결제상태 50
            req.paramBody['groupbuying_option_uid'],
        ]
    );
}

function queryCreateGroupBuyingRoom(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_groupbuyingroom'
        , [
            req.headers['user_uid'],
            req.paramBody['groupbuying_uid'],
            req.paramBody['groupbuying_option_uid'],
            req.paramBody['recruitment'],
            req.paramBody['quantity'],
        ]
    );
}

function queryCreateGroupBuyingRoomUser(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_groupbuyingroomuser'
        , [
            req.headers['user_uid'],
            req.paramBody['groupbuying_room_uid'],
            req.paramBody['groupbuying_option_uid'],
            req.paramBody['quantity'],
        ]
    );
}

function queryUpdateGroupBuyingOption(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_update_groupbuyingoption_v1'
        , [
            req.paramBody['groupbuying_uid'],
            req.paramBody['groupbuying_option_uid'],
            req.paramBody['quantity'],
        ]
    );
}

function queryUpdateGroupBuying_soldout(req, db_connection) {
    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_groupbuying_soldout_v1'
        , [
            req.paramBody['groupbuying_uid'],
        ]
    );
}

function queryUpdateOrderProduct(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_order_product_status_01_for_groupbuying_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['groupbuying_room_uid'],
        ]
    );
}

function queryKakaoLink(req, db_connection){
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_groupbuying_kakao_link_v1'
        , [
            req.innerBody['product']['product_uid']
        ]
    )
}

async function orderAlarm(req, res) {
    // 공구하기는 하나의 상품만 구매할 수 있다. 여러 판매자한테 동시에 알람을 보내지 않아도 된다.
    // const push_token_list = Array.from(new Set(req.innerBody['push_token_list']))
    // await fcmUtil.fcmCreateOrderList(push_token_list);

    // const push_token_list = req.innerBody['push_token_list']
    const push_token_list = Array.from(new Set(req.innerBody['push_token_list']))// 푸시토큰안에는 판매자가 아니라 구매자 푸시토큰이 있다.

    console.log('push_token_list', push_token_list)

    await fcmUtil.fcmCreateOrderList(push_token_list);//판매자에게 fcm주문접수 알람을 보낸다.

    req.body= {
        type: 's',
        time: '9999'
    }
    await aligoUtil.createToken(req, res); //알리고 createToken을 보낸다.


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
    console.log(alrim_msg_distinc_list)

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


function makePushTokenAndAligoParam(req, product){
    let obj = {"phone": product['phone'], name: product['name'], nickname: product['nickname']}
    req.innerBody['push_token_list'].push(product['push_token']);
    req.innerBody['alrim_msg_list'].push(obj)

    console.log('push_token_list', req.innerBody['push_token_list'])
    console.log('alrim_msg_list', req.innerBody['alrim_msg_list'])
}

function queryGonguRoomUser(req, db_connection){
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_order_room_all_user_v1'
        , [
            req.paramBody['groupbuying_room_uid']
        ]
    )
}

async function orderMatchAlarm(item) {
    const pushData = {
        push_token: item.map(result=>result.push_token),
        product_name: item[0].product_name
    }
    
    await fcmUtil.fcmGonguMatchSuccess(pushData);
}