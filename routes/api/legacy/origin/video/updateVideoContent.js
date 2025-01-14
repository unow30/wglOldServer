/**
 * Created by hyunhunhwang on 2021. 01. 12.
 *
 * @swagger
 * /api/private/video/content:
 *   put:
 *     summary: 영상 Content 업데이트
 *     tags: [Video]
 *     description: |
 *       path : /api/private/video/content
 *
 *       * 영상 Content 업데이트
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           영상 Content 업데이트
 *         schema:
 *           type: object
 *           required:
 *             - video_uid
 *           properties:
 *             video_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 영상 uid
 *             content:
 *               type: string
 *               example: 콰삭 콰삭
 *               description: |
 *                 영상 글
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/VideoApi'
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
const jwtUtil = require('../../../../../common/utils/legacy/origin/jwtUtil');

const errCode = require('../../../../../common/define/errCode');

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
    paramUtil.checkParam_noReturn(req.paramBody, 'video_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'content');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_video_content'
        , [
            // req.headers['user_uid'],
            req.paramBody['video_uid'],
            req.paramBody['content'],
        ]
    );
}

