/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/weggler/community/letmeknow/list/all:
 *   get:
 *     summary: 커뮤니티 알려줘요 리스트
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/community/letmeknow/list/all
 *
 *       * 커뮤니티 알려줘요 리스트
 *       * limit 15 이므로 offset 15씩 증가
 * 
 *     parameters:
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           offset
 *
 *     responses:
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
        req.paramBody['type'] = 1

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};
            
            req.innerBody['item'] = await query(req, db_connection);
            

            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });
    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

async function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_weggler_community_letmeknow_list_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['type'],
            req.paramBody['offset'],
        ]
    );
}