/**
 *
 * @swagger
 * /api/private/v2/weggler/community/blah:
 *   post:
 *     summary: 커뮤니티 끄적끄적 게시물 생성
 *     tags: [Weggler]
 *     description: |
 *       path : /api/private/v2/weggler/community/blah
 *
 *       * 커뮤니티 끄적끄적 게시물 생성
 *       * type: 1: 끄적끄적, 2: 위글꿀팁, 3: 궁금해요 
 *
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
 *               example: 리뷰 내용입니다.
 *               description: 리뷰 내용
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/VideoReviewApi'
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
        req.paramBody['type'] = 1 // 1: 끄적끄적, 2: 위글꿀팁, 3: 궁금해요

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            const dayPost = await queryPointDay(req, db_connection)
            const allPost = await queryPointAll(req, db_connection)
            console.log(allPost, '============>> all post')
            console.log(dayPost, '============>> day post')

            req.innerBody['item'] = await query(req, db_connection);
            
            let pointPayment = 0

            const content = req.paramBody.content.replace(/ /gi,'')
            if(allPost.length == 0){
                //첫 포인트 500포인트 지급
                req.paramBody.point = 500
                req.paramBody.point_type = 1
                req.paramBody.message = '커뮤니티 첫 게시글 작성 포인트 지급 이벤트'
                req.paramBody.first = 1
                await queryAddPoint(req, db_connection)
                pointPayment = 1
            }
            else if(content.length >= 10 && dayPost.length < 11){
                //하루에 10번까지 10포인트 지급
                req.paramBody.point = 10
                req.paramBody.point_type = 1
                req.paramBody.message = '커뮤니티 게시글 작성 포인트 지급 이벤트'
                req.paramBody.first = 0
                await queryAddPoint(req, db_connection)
                pointPayment = 1
            }
            req.innerBody.item['point_payment'] = {
                pointPayment: pointPayment,
                point: req.paramBody.point? req.paramBody.point: 0,
                first: req.paramBody.first? req.paramBody.first: 0
            }

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
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_community_blah_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['title'],
            req.paramBody['content'],
            req.paramBody['type'],
        ]
    );
}

function queryPointAll(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_community_post_one_v2'
        , [
            req.headers['user_uid'],
        ]
    );
}

function queryPointDay(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_community_post_day_v2'
        , [
            req.headers['user_uid'],
        ]
    );
}

function queryAddPoint(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_insert_community_post_point_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['point_type'],
            req.paramBody['point'],
            req.paramBody['message'],
        ]
    );
}