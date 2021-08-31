/**
 * Created by hyunhunhwang on 2021. 01. 18.
 *
 * @swagger
 * /api/private/video/review:
 *   post:
 *     summary: 리뷰영상 작성
 *     tags: [Video]
 *     description: |
 *       path : /api/private/video/review
 *
 *       * 리뷰영상 작성
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           리뷰영상 작성
 *         schema:
 *           type: object
 *           required:
 *             - product_uid
 *             - content
 *             - filename
 *           properties:
 *             product_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 상품 uid
 *             content:
 *               type: string
 *               example: 리뷰 내용입니다.
 *               description: 리뷰 내용
 *             filename:
 *               type: string
 *               example: abcde.mp4
 *               description: |
 *                 영상 파일명
 *                 * /api/public/file api 호출뒤 응답값인 filename 를 사용
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
const fcmUtil = require('../../../common/utils/fcmUtil');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        // logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await query(req, db_connection);

            await fcmUtil.fcmReviewVideoSingle(req.innerBody['item']['push_token'], req.innerBody['item']['product_name'],
                                               req.innerBody['item']['uid'])

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
    paramUtil.checkParam_noReturn(req.paramBody, 'product_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'content');
    paramUtil.checkParam_noReturn(req.paramBody, 'filename');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_video_review'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
            req.paramBody['content'],
            req.paramBody['filename'],
        ]
    );
}

