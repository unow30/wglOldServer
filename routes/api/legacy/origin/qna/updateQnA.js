/**
 * Created by hyunhunhwang on 2021. 01. 16.
 *
 * @swagger
 * /api/private/qna:
 *   put:
 *     summary: 문의하기 수정
 *     tags: [QnA]
 *     description: |
 *       path : /api/private/qna
 *
 *       * 문의하기 수정
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           문의하기 수정
 *         schema:
 *           type: object
 *           required:
 *             - qna_uid
 *             - type
 *             - question
 *             - is_secret
 *           properties:
 *             qna_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 수정할 qna uid
 *             type:
 *               type: number
 *               example: 1
 *               description: |
 *                 질문 유형(위글에서 정의해 줘야함)
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
 *           $ref: '#/definitions/QnAUpdateApi'
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

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await query(req, db_connection);

            deleteBody(req)
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
    paramUtil.checkParam_noReturn(req.paramBody, 'qna_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'type');
    paramUtil.checkParam_noReturn(req.paramBody, 'question');
    paramUtil.checkParam_noReturn(req.paramBody, 'is_secret');

}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_qna'
        , [
            req.headers['user_uid'],
            req.paramBody['qna_uid'],
            req.paramBody['type'],
            req.paramBody['question'],
            req.paramBody['is_secret'],
        ]
    );
}
