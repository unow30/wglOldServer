/**
 *
 * 
 * Created by jongho
 * 
 * @swagger
 * /api/private/v2/weggler/story/visit:
 *   post:
 *     summary: 위글러 스토리 방문 여부 생성
 *     tags: [Weggler]
 *     description: |
 *       path : /api/private/v2/weggler/story/visit
 *
 *       * 위글러 스토리 방문 여부 생성
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           위글러 스토리 방문 여부 생성
 *         schema:
 *           type: object
 *           required:
 *             - review_uid
 *             - type
 *             - created_time
 *           properties:
 *             review_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 리뷰 uid
 *             type:
 *               type: number
 *               example: 1
 *               description: |
 *                  1: 비디오, 2: 포토
 *             created_time:
 *               type: string
 *               example: 2021-11-10 22:40:23
 *               description: |
 *                  방문한 리뷰 생성한 날짜
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

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};
            req.innerBody['item'] = await query(req, db_connection)

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
    paramUtil.checkParam_noReturn(req.paramBody, 'review_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'type');
    paramUtil.checkParam_noReturn(req.paramBody, 'created_time');
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_insert_weggler_story_visit_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['review_uid'],
            req.paramBody['type'],
            req.paramBody['created_time'],
        ]
    );
}