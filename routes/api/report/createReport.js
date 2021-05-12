/**
 * Created by hyunhunhwang on 2021. 01. 10.
 *
 * @swagger
 * /api/private/report:
 *   post:
 *     summary: 영상 신고 하기
 *     tags: [Report]
 *     description: |
 *       path : /api/private/report
 *
 *       * 영상 신고 하기
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           영상 신고하기
 *         schema:
 *           type: object
 *           required:
 *             - video_uid
 *             - choice_value
 *           properties:
 *             video_uid:
 *               type: number
 *               description: |
 *                 신고할 영상 uid
 *             choice_value:
 *               type: number
 *               description: |
 *                 신고 선택지 - 비트연산
 *                 ==> ex) 1+4+16 = 21
 *                 * 1: 상품 정보 오류, 거짓 정보
 *                 * 2: 타인 사칭
 *                 * 4: 만 14세 미만 계정
 *                 * 8: 지적 재산권 침해, 규제 상품 판매
 *                 * 16: 적잘하지 않은 게시물(신체노출, 자해, 불법, 혐오, 발언, 폭력)
 *                 * 32: 기타
 *             content:
 *               type: string
 *               description: |
 *                 신고 내용
 *
 *           example:
 *             video_uid: 1
 *             choice_value: 21
 *             content: 신고 내용입니다.
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

const errCode = require('../../../common/define/errCode');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        // logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
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
    paramUtil.checkParam_noReturn(req.paramBody, 'video_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'choice_value');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_report'
        , [
            req.headers['user_uid'],
            req.paramBody['video_uid'],
            req.paramBody['choice_value'],
            req.paramBody['content'],
        ]
    );
}

