/**
 * Created by yunhokim on 2022. 01. 21.
 *
 * @swagger
 * /api/private/alert/comment:
 *   put:
 *     summary: 댓글 등록 알림 on/off
 *     tags: [Alert]
 *     description: |
 *       path : /api/private/alert/comment
 *
 *       * 댓글 등록 알림 on/off
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           댓글 등록 알림 on/off
 *         schema:
 *           type: object
 *           required:
 *             - is_alert_comment
 *           properties:
 *             is_alert_comment:
 *               type: number
 *               example: 0
 *               description: |
 *                 댓글 등록 알림 on/off
 *                 * 0: on
 *                 * 1: off
 *               enum: [0,1]
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const paramUtil = require('../../../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../../../common/utils/legacy/origin/logUtil');
const jwtUtil = require('../../../../../../common/utils/legacy/origin/jwtUtil');

const errCode = require('../../../../../../common/define/errCode');

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

            let data = await query(req, db_connection);
            console.log(data)
            req.innerBody['result'] = data['alert_message']
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
    paramUtil.checkParam_noReturn(req.paramBody, 'is_alert_comment');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_alert_comment'
        , [
            req.headers['user_uid'],
            req.paramBody['is_alert_comment'],
        ]
    );
}

