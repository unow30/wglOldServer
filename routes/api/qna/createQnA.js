/**
 * Created by gunucklee on 2021. 07. 05.
 *
 * @swagger
 * /api/private/qna:
 *   post:
 *     summary: 문의하기 작성
 *     tags: [QnA]
 *     description: |
 *       path : /api/private/qna
 *
 *       * 문의하기 작성
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           문의하기 작성
 *         schema:
 *           type: object
 *           required:
 *             - product_uid
 *             - type
 *             - question
 *             - is_secret
 *           properties:
 *             product_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 상품 uid
 *             order_product_uid:
 *               type: number
 *               example: 0
 *               description: |
 *                 주문 상품 uid
 *             type:
 *               type: number
 *               example: 1
 *               description: |
 *                 질문 유형
 *                 * 1: 상품
 *                 * 2: 배송
 *                 * 3: 반품
 *                 * 4: 교환
 *                 * 5: 환불
 *                 * 6: 기타
 *               enum: [1,2,3,4,5,6]
 *             question:
 *               type: string
 *               example: 문의해요
 *               description: 문의 내용
 *             is_secret:
 *               type: number
 *               example: 0
 *               description: |
 *                 비밀글 여부
 *                 * 0: false
 *                 * 1: true(비밀글)
 *               enum: [0,1]
 *
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/QnAApi'
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
const fcmUtil = require('../../../common/utils/fcmUtil');
const aligoUtil = require('../../../common/utils/aligoUtil');

const errCode = require('../../../common/define/errCode');

let file_name = fileUtil.name(__filename);

const axios = require('axios');
const {log} = require("debug");

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            let count_info = await queryCheck(req, db_connection);
            if (count_info['count'] > 0) {
                errUtil.createCall(errCode.already, `동일한 내용이 존재합니다.`)
                return
            }
            req.innerBody['item'] = await query(req, db_connection);
            let alertList = await queryAlertComment(req, db_connection);

            const question_type = convertType(req.innerBody['item']['type'])

            if(alertList['is_alert_product_qna'] == 0){
                await fcmUtil.fcmProductQnASingle(req.innerBody['item'], question_type);
            }


            await alarm(req, res);

            deleteBody(req);

            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        } );

    }
    catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function checkParam(req) {
    paramUtil.checkParam_noReturn(req.paramBody, 'product_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'type');
    paramUtil.checkParam_noReturn(req.paramBody, 'question');
    paramUtil.checkParam_noReturn(req.paramBody, 'is_secret');

    if(!req.paramBody['order_product_uid'])
        req.paramBody['order_product_uid'] = 0;

}

function deleteBody(req) {
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_qna'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
            req.paramBody['order_product_uid'],
            req.paramBody['type'],
            req.paramBody['question'],
            req.paramBody['is_secret'],
        ]
    );
}

function queryCheck(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_qna_check'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
            req.paramBody['order_product_uid'],
            req.paramBody['type'],
            req.paramBody['content'],
        ]
    );
}

function queryAlertComment(req, db_connection){

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_alert_list'
        , [
            req.innerBody['item']['seller_uid']
        ]
    )
}

function convertType(type) {
    let question_type = '';
    switch (type) {
        case 1 :
            question_type = '상품'
            break;
        case 2:
            question_type = '배송'
            break;
        case 3:
            question_type = '반품'
            break;
        case 4:
            question_type = '교환'
            break;
        case 5:
            question_type = '환불'
            break;
        case 6:
            question_type = '기타'
            break;
    }


    return question_type;
}





async function alarm(req, res) {

    try {
        axios.defaults.headers.common['Authorization'] = 'key=AAAAH1HxpKo:APA91bEGjPgOgXK2xZ-uqZHiR_PT69tO4knZt6ZCRpAXRESsnuY23MXWFneIQ-EALixYNkcUZg0iNczMW8eXc9ZLp6_dd1Kmz0t4rw5rJwboLwG-65hS0nyNps5OchEw72zP8dzlLNIa';
        axios.defaults.headers.post['Content-Type'] = 'application/json';
        req.body= {
            type: 's',
            time: '9999'
        }
        await aligoUtil.createToken(req, res);

        req.body= {
            senderkey: `${process.env.ALIGO_SENDERKEY}`,
            tpl_code: `TF_6894`,
            sender: `025580612`,
            subject_1: `문의사항 등록 알림(판매자)`,
        }

        req.body['receiver_1'] = req.innerBody['item']['phone'];
        req.body['message_1'] = setArimMessage(req);
        console.log("ASDASDKAJD12qdIAA: " + JSON.stringify(req.innerBody));
        console.log(`testettt: ${req.body['message_1']}`)
        await aligoUtil.alimSend(req, res);




    }
    catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }


}


function setArimMessage(req) {
    return `${req.innerBody['item']['seller_nickname']}님,
${req.innerBody['item']['product_name']}에 대한 ${convertType(req.innerBody['item']['type'])} 문의가 등록되었습니다.

판매자 페이지를 통해 확인 부탁드립니다.`
}
