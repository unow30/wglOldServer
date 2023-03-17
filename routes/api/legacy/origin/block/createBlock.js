/**
 * Created by yunhokim on 2022. 02. 04.
 *
 * @swagger
 * /api/private/block:
 *   post:
 *     summary: 차단하기(영상,댓글,대댓글,유저)
 *     tags: [Block]
 *     description: |
 *       path : /api/private/block
 *
 *       * 차단하기(영상,댓글,대댓글)
 *       * 엑세스토큰의 user_uid 사용.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           차단하기(영상,댓글,대댓글,유저)
 *
 *           type
 *           * 1: 영상 uid
 *           * 2: 댓글 uid
 *           * 3: 대댓글 uid
 *           * 4: 유저 uid
 *         schema:
 *           type: object
 *           required:
 *             - target_uid
 *             - type
 *           properties:
 *             target_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 차단할 uid
 *             type:
 *               type: number
 *               example: 1
 *               description: |
 *                 차단 타입
 *                 * 1: 영상 uid 차단
 *                 * 2: 댓글 uid 차단
 *                 * 3: 대댓글 uid 차단
 *                 * 4: 유저 uid 차단
 *               enum: [1, 2, 3, 4]
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/BlockApi'
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */
const fileUtil = require('../../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../../common/utils/legacy/origin/logUtil');
const paramUtil = require('../../../../../common/utils/legacy/origin/paramUtil');

const errCode = require('../../../../../common/define/errCode');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {}

            req.innerBody['item'] = await query(req, db_connection);

            // deleteBody(req)

            logUtil.printUrlLog(req, `param: ${JSON.stringify(req.innerBody)}`);

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
}

function deleteBody(req) {

}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_block'
        , [
            req.headers['user_uid'],
            req.paramBody['target_uid'],
            req.paramBody['type'],
        ]
    );
}

