/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/weggler/letmeknow/detail:
 *   get:
 *     summary: 알려줘요 상세페이지
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/letmeknow/detail
 *
 *       * 알려줘요 게시물 상세페이지
 * 
 *     parameters:
 *       - in: query
 *         name: post_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 77
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
const dateUtil = require('../../../../../common/utils/legacy/origin/dateUtil')


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
        const files = await queryMedia(req, db_connection)
        console.log(files,'==========>>>files')
        console.log(req.innerBody['item'],'==========>>>files')
        req.innerBody.item['files'] = await queryMedia(req, db_connection)

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

    return mysqlUtil.querySingle(db_connection
        , 'call proc_weggler_letmeknow_detail_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['post_uid'],
            req.paramBody['type'],
        ]
    );
}

async function queryMedia(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_weggler_letmeknow_detail_media_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['post_uid'],
        ]
    );
}