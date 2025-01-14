/**
 *
 * @swagger
 * /api/public/v1/follower/list:
 *   get:
 *     summary: 팔로워 목록
 *     tags: [Follow]
 *     description: |
 *       path : /api/public/v1/follower/list
 *
 *       * 팔로우 목록
 *
 *     parameters:
 *       - in: query
 *         name: target_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 검색 uid
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: integer
 *           example: 0
 *         description: |
 *           offset 20씩 증가
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/FollowListApi'
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

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
        req.innerBody = {};

        req.innerBody['item'] = await querySelect(req, db_connection);

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
    paramUtil.checkParam_noReturn(req.paramBody, 'offset');
    paramUtil.checkParam_noReturn(req.paramBody, 'target_uid');

}

 
function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_follower_list_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['target_uid'],
            req.paramBody['offset'],
        ]
    );
}