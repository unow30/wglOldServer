/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/weggler/community/post:
 *   delete:
 *     summary: 위글러 커뮤니티 게시글 삭제
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/community/post
 *
 * 
 *     parameters:
 *       - in: query
 *         name: post_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           post_id
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
        checkParam(req)
        
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

function checkParam(req) {
    paramUtil.checkParam_noReturn(req.paramBody, 'post_uid');
}

async function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_delete_weggler_community_post_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['post_uid'],
        ]
    );
}