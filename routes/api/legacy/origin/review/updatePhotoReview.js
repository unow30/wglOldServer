/**
 *
 * @swagger
 * /api/private/v1/review/photo:
 *   put:
 *     summary: 상품의 포토리뷰 수정
 *     tags: [Review]
 *     description: |
 *       path : /api/private/v1/review/photo
 *
 *       * 포토리뷰 수정
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           포토리뷰 수정
 *
 *         schema:
 *           type: object
 *           required:
 *             - content
 *             - photo_review_uid
 *           properties:
 *             photo_review_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 포토리뷰 uid
 *             content:
 *               type: string
 *               example: 이거 너무 맛있어요~~
 *               description: |
 *                 리뷰 내용
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const paramUtil = require('../../../../../common/utils/paramUtil');
const fileUtil = require('../../../../../common/utils/fileUtil');
const mysqlUtil = require('../../../../../common/utils/mysqlUtil');
const sendUtil = require('../../../../../common/utils/sendUtil');
const errUtil = require('../../../../../common/utils/errUtil');
const logUtil = require('../../../../../common/utils/logUtil');
const fcmUtil = require('../../../../../common/utils/fcmUtil');

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
    paramUtil.checkParam_noReturn(req.paramBody, 'content');
    paramUtil.checkParam_noReturn(req.paramBody, 'photo_review_uid');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_photo_review_v1'
        , [
            req.paramBody['photo_review_uid'],
            req.headers['user_uid'],
            req.paramBody['content'],

        ]
    );
}