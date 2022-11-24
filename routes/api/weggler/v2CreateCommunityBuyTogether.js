/**
 *
 * @swagger
 * /api/private/v2/weggler/community/buytogether:
 *   post:
 *     summary: 커뮤니티 궁금해요 게시물 생성
 *     tags: [Weggler]
 *     description: |
 *       path : /api/private/v2/weggler/community/buytogether
 *
 *       * 커뮤니티 공구해요 게시물 생성
 *       * type: 1: 알려줘요, 2: 공구해요
 *       * 작성데이터 => { title: blah, content: 안녕하세요, groupbuying_uid: 1 }
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           리뷰영상 작성
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - content
 *           properties:
 *             title:
 *               type: string
 *               example: 안녕하세요
 *               description: |
 *                 상품 uid
 *             content:
 *               type: string
 *               example: 안녕하세요 반갑습니다.
 *               description: 대표 내용
 *             groupbuying_uid:
 *               type: number
 *               example: 1
 *               description: 링크
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const path = require('path');
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
        req.paramBody = paramUtil.parse(req);

        checkParam(req);
        req.paramBody['type'] = 2 // 1: 알려줘요, 2: 궁금해요

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};
            req.innerBody['item'] = await query(req, db_connection);
            
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
    paramUtil.checkParam_noReturn(req.paramBody, 'title');
    paramUtil.checkParam_noReturn(req.paramBody, 'content');
    paramUtil.checkParam_noReturn(req.paramBody, 'groupbuying_uid');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_community_buytogether_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['title'],
            req.paramBody['content'],
            req.paramBody['groupbuying_uid'],
            req.paramBody['type'],
        ]
    );
}