/**
 * Created by hyunhunhwang on 2021. 01. 08.
 *
 * @swagger
 * /api/private/comment/nested:
 *   post:
 *     summary: 대댓글 작성
 *     tags: [Comment]
 *     description: |
 *       path : /api/private/comment/nested
 *
 *       * 대댓글 작성
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           대댓글 작성
 *         schema:
 *           type: object
 *           required:
 *             - comment_uid
 *             - content
 *           properties:
 *             comment_uid:
 *               type: number
 *               description: |
 *                 댓글 uid
 *             content:
 *               type: string
 *               description: |
 *                 내용
 *
 *           example:
 *             comment_uid: 1
 *             content: 대댓글 입니다.
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/Comment'
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
const fcmUtil = require('../../../common/utils/fcmUtil');

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

            req.innerBody['item'] = await query(req, db_connection);
            if(req.headers['user_uid'] !== req.innerBody['item']['comment_user_uid'])
                await fcmUtil.fcmNestedCommentSingle(req.innerBody['item']);

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
    paramUtil.checkParam_noReturn(req.paramBody, 'comment_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'content');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_nested_comment'
        , [
            req.headers['user_uid'],
            req.paramBody['comment_uid'],
            req.paramBody['content'],
        ]
    );
}


