/**
 * Created by gunucklee on 2021. 07. 14.
 *
 * @swagger
 * /api/private/report:
 *   post:
 *     summary: 신고 하기
 *     tags: [Report]
 *     description: |
 *       path : /api/private/report
 *
 *       * 신고 하기
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           영상 신고하기
 *         schema:
 *           type: object
 *           required:
 *             - target_uid
 *             - choice_value
 *             - content
 *             - type
 *           properties:
 *             target_uid:
 *               type: number
 *               description: |
 *                 신고할 uid
 *             choice_value:
 *               type: number
 *               description: |
 *                 신고 선택지 - 비트연산
 *                 ==> ex) 1+4+16 = 21
 *                 * 1: 나체 이미지 또는 성적 행위
 *                 * 2: 혐오 발언 또는 상징
 *                 * 4: 불법 또는 규제 상품 판매
 *                 * 8: 거짓 정보 및 지적 재산권 침해
 *                 * 16: 기타
 *             content:
 *               type: string
 *               description: |
 *                 신고 내용
 *             type:
 *               type: number
 *               description: |
 *                 신고 타입
 *                 * 1: 유저 신고
 *                 * 2: 영상 신고
 *                 * 3: 댓글 신고
 *
 *           example:
 *             target_uid: 1
 *             choice_value: 2
 *             content: 테스트 이 유저는 혐오 발언을 했습니다. 신고 112
 *             type: 1
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/ReportApi'
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
const jwtUtil = require('../../../../../common/utils/legacy/origin/jwtUtil');

const errCode = require('../../../../../common/define/errCode');

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
    paramUtil.checkParam_noReturn(req.paramBody, 'target_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'choice_value');
    paramUtil.checkParam_noReturn(req.paramBody, 'type');
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
            req.paramBody['target_uid'],
            req.paramBody['choice_value'],
            req.paramBody['content'],
            req.paramBody['type'],
        ]
    );
}

