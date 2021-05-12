/**
 * Created by hyunhunhwang on 2021. 01. 04.
 *
 * @swagger
 * /api/private/follow:
 *   post:
 *     summary: 팔로우 하기
 *     tags: [Follow]
 *     description: |
 *       path : /api/private/follow
 *
 *       * 팔로우 하기
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           팔로잉
 *         schema:
 *           type: object
 *           required:
 *             - user_uid
 *           properties:
 *             user_uid:
 *               type: integer
 *               description: |
 *                 팔오잉 타겟 유저 uid
 *
 *           example:
 *             user_uid: 1
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/Follow'
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
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await queryCheck(req, db_connection);
            if (req.innerBody['item']) {
                errUtil.createCall(errCode.already, `이미 팔로우된 유저입니다.`)
                return
            }
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
    paramUtil.checkParam_noReturn(req.paramBody, 'user_uid');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_follow'
        , [
            req.headers['user_uid'],
            req.paramBody['user_uid'],
        ]
    );
}

function queryCheck(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_follow_check'
        , [
            req.headers['user_uid'],
            req.paramBody['user_uid'],
        ]
    );
}

