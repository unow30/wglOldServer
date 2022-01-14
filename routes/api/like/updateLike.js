/**
 * Created by gunucklee on 2021. 07. 16.
 *
 * @swagger
 * /api/private/like:
 *   put:
 *     summary: 좋아요 or 찜하기
 *     tags: [Like]
 *     description: |
 *       path : /api/private/like
 *
 *       * 좋아요 or 찜하기
 *       * like or unlike
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           좋아요
 *         schema:
 *           type: object
 *           required:
 *             - target_uid
 *           properties:
 *             target_uid:
 *               type: number
 *               description: |
 *                 타겟 uid
 *                 * type에 따라 처리
 *                 * type==1: 상품 uid
 *                 * type==2: 영상 uid
 *                 * type==3: 댓글 uid
 *             type:
 *               type: number
 *               description: |
 *                 좋아요(찜하기) 타입
 *                 * 1: 상품 찜하기
 *                 * 2: 영상 좋아요
 *                 * 3: 댓글 좋아요
 *               enum: [1,2,3]
 *             is_like:
 *               type: number
 *               description: |
 *                 좋아요 여부
 *                 * 0: unlike
 *                 * 1: like
 *               enum: [0,1]
 *             video_uid:
 *               type: number
 *               description: |
 *                 상품 찜하기 시 리워드를 전달할 video uid
 *
 *           example:
 *             target_uid: 1
 *             type: 1
 *             is_like: 1
 *             video_uid: 0
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/LikeUpdateApi'
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
        // logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await query(req, db_connection);

            if( parseInt(req.paramBody['type']) === 1 ){
                await queryUpdateCount(req, db_connection)
            }

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
    paramUtil.checkParam_noReturn(req.paramBody, 'target_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'type');
    paramUtil.checkParam_noReturn(req.paramBody, 'is_like');

    if(!req.paramBody['video_uid'])
        req.paramBody['video_uid'] = '';
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_like'
        , [
            req.headers['user_uid'],
            req.paramBody['target_uid'],
            req.paramBody['type'],
            req.paramBody['is_like'],
            req.paramBody['video_uid'],
        ]
    );
}

function queryUpdateCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_product_count_like'
        , [
            req.paramBody['target_uid'],
        ]
    );
}

