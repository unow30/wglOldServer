/**
 * Created by gunucklee on 2021. 11. 23.
 *
 * @swagger
 * /api/private/gift/order:
 *   put:
 *     summary: 선물 받기
 *     tags: [Gift]
 *     description: |
 *       path : /api/private/gift/order
 *
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           최근 본 상품 업데이트
 *         schema:
 *           type: object
 *           required:
 *             - gift_uid
 *             - order_uid
 *             - phone
 *             - zipcode
 *             - address
 *             - address_detail
 *           properties:
 *             gift_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 선물 uid
 *             order_uid:
 *               type: number
 *               example: 13
 *               description: |
 *                 주문 uid
 *             phone:
 *               type: string
 *               example: 01042474682
 *               description: |
 *                 선물 받는 사람의 전화번호
 *             zipcode:
 *               type: string
 *               example: 603944
 *               description: |
 *                 선물 받는 사람의 우편번호
 *             address:
 *               type: string
 *               example: 부산 수영구 망미동 23번길 7
 *               description: |
 *                 선물 받는 사람의 주소
 *             address_detail:
 *               type: string
 *               example: 422호
 *               description: |
 *                 선물 받는 사람의 상세 주소
 *             delivery_msg:
 *               type: string
 *               example: 경비실에 맡겨 주세요.
 *               description: |
 *                 선물 받는 사람의 배송 메모
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/GiftOrderApi'
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */
const paramUtil = require('../../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../../common/utils/legacy/origin/logUtil');
const fcmUtil = require('../../../../../common/utils/legacy/origin/fcmUtil');
const aligoUtil = require('../../../../../common/utils/legacy/origin/aligoUtil');
const errCode = require('../../../../../common/define/errCode');

const axios = require('axios');
let file_name = fileUtil.name(__filename);

axios.defaults.headers.common['Authorization'] = 'key=AAAAH1HxpKo:APA91bEGjPgOgXK2xZ-uqZHiR_PT69tO4knZt6ZCRpAXRESsnuY23MXWFneIQ-EALixYNkcUZg0iNczMW8eXc9ZLp6_dd1Kmz0t4rw5rJwboLwG-65hS0nyNps5OchEw72zP8dzlLNIa';
axios.defaults.headers.post['Content-Type'] = 'application/json';

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);
        console.log("sdasadada difjsdifosjdio")
        console.log(JSON.stringify(req.paramBody))

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            let giftInfo = await querySelect(req, db_connection);

            switch (giftInfo['status']) {
                case 0:
                    req.innerBody['item'] = await query(req, db_connection);
                    // 카카오 보내고 fcm 보내고
                    console.log(JSON.stringify(req.innerBody['item']))
                    await alarm(req, res);
                    deleteBody(req)

                    sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
                    break;
                case 10:
                case 11:
                case 20:
                    errUtil.createCall(errCode.fail, `결제가 취소된 선물입니다.`)
                    break;
                case 1:
                    errUtil.createCall(errCode.fail, `이미 수락된 선물입니다.`)
                    break;
                default:
                    errUtil.createCall(errCode.fail, `올바르지 않은 status입니다.`)
                    break;
            }

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });

    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function checkParam(req) {
    paramUtil.checkParam_noReturn(req.paramBody, 'gift_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'order_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'phone');
    paramUtil.checkParam_noReturn(req.paramBody, 'zipcode');
    paramUtil.checkParam_noReturn(req.paramBody, 'address');
    paramUtil.checkParam_noReturn(req.paramBody, 'address_detail');
}

function deleteBody(req) {
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_gift_reg'
        , [
            req.headers['user_uid'],
            req.paramBody['gift_uid'],
            req.paramBody['order_uid'],
            req.paramBody['phone'],
            req.paramBody['zipcode'],
            req.paramBody['address'],
            req.paramBody['address_detail'],
            req.paramBody['delivery_msg'],
        ]
    );
}

async function querySelect(req, db_connection) {
    return new Promise(async (resolve, reject) => {
        const query = `
            select 
                g.status,
                g.target_uid
            from tbl_gift as g
            where g.uid = ?
        `;
        await db_connection.query(query, [req.paramBody['gift_uid']], async (err, rows, fields) => {
            if (err) {
                reject('db상품정보 검색 연결 실패');
            } else if (rows.length === 0) {
                reject(`상품정보를 찾을 수 없습니다.`);
            } else {
                resolve(rows[0]);
            }
        });
    });
}


async function alarm(req, res) {

    const push_token_list = [];
    console.log('푸시토큰 push하기 전: ' + req.innerBody['item']['push_token']);
    push_token_list.push(req.innerBody['item']['push_token']);
    console.log('dssdokowkqdqo: ' + JSON.stringify(push_token_list));
    await fcmUtil.fcmCreateOrderList(push_token_list);


    req.body = {
        type: 's',
        time: '9999'
    }
    await aligoUtil.createToken(req, res);


    req.body = {
        senderkey: `${process.env.ALIGO_SENDERKEY}`,
        tpl_code: `TF_6863`,
        sender: `025580612`,
        subject_1: `상품 주문 알림(판매자)`,
    }

    req.body[`receiver_1`] = req.innerBody['item']['seller_phone']
    req.body[`message_1`] = setArimMessage(req)
    await aligoUtil.alimSend(req, res);
}


function setArimMessage(req) {
    return `상품 주문 알림

${req.innerBody['item']['nickname']}님, 판매하시는 상품에 신규 주문이 들어왔습니다. 판매자 페이지에서 확인 부탁드립니다.

□ 주문상품 : ${req.innerBody['item']['product_name']}`
}

