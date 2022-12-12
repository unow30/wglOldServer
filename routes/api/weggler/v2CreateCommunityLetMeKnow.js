/**
 *
 * 
 * Created by jongho
 * 
 * @swagger
 * /api/private/v2/weggler/community/letmeknow:
 *   post:
 *     summary: 커뮤니티 알려줘요 게시물 생성
 *     tags: [Weggler]
 *     description: |
 *       path : /api/private/v2/weggler/community/letmeknow
 *
 *       * 커뮤니티 위글꿀팁 게시물 생성
 *       * type: 1: 알려줘요, 2: 공구해요
 *       * 글만 작성의 경우 => { title: blah, content: 안녕하세요, files: [] 빈 배열 꼭 넣어줄것}
 *       * 글+이미지 작성의 경우 => { title: blah, content: 안녕하세요, files: [{type: 1, filename: abcd.jpg, thumbnail: abcd.jpg}] }
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
 *             link:
 *               type: string
 *               example: www.naver.com
 *               description: 링크
 *             files:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: number
 *                   filename:
 *                     type: string
 *                   thumbnail:
 *                     type: string
 *               example: [{type: 1, filename: abcd.jpg, thumbnail: abcd.jpg}]
 *                 
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
        req.paramBody['type'] = 1 // 1: 알려줘요, 2: 공구해요

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            const dayPost = await queryPointDay(req, db_connection)
            const allPost = await queryPointAll(req, db_connection)
            console.log(allPost, '============>> all post')
            console.log(dayPost, '============>> day post')

            
            
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
            else if(req.paramBody['files'][0] && dayPost.length < 10){
                //하루에 10번까지 이미지 업로드 게시물의 경우 30포인트
                req.paramBody.point = 30
                req.paramBody.point_type = 1
                req.paramBody.message = '커뮤니티 게시글 작성 포인트 지급 이벤트'
                req.paramBody.first = 0
                await queryAddPoint(req, db_connection)
                pointPayment = 1
            }
            else if(content.length >= 10&& dayPost.length < 10){
                //하루에 10번까지 일반 업로드 게시물의 경우 10포인트
                req.paramBody.point = 10
                req.paramBody.point_type = 1
                req.paramBody.message = '커뮤니티 게시글 작성 포인트 지급 이벤트'
                req.paramBody.first = 0
                await queryAddPoint(req, db_connection)
                pointPayment = 1
            }

            req.innerBody['item'] = await query(req, db_connection);

            if(req.paramBody['files'][0]){
                await queryfilesBulkInsert(req, db_connection)
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


function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_community_letmeknow_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['title'],
            req.paramBody['content'],
            req.paramBody['type'],
            req.paramBody['link'],
        ]
    );
}

async function queryfilesBulkInsert(req, db_connection) {
    const _funcName = arguments.callee.name;
    console.log(req.paramBody['files'])
    const fileData = req.paramBody['files'].map(result =>{
        console.log(result, '맵 안')
        if(result.type == 1){
           
            return [req.innerBody.item['uid'], result.filename, result.thumbnail, result.type]
        }
        else if(result.type == 2){

            return [req.innerBody.item['uid'], result.filename, result.filename, result.type]
        }
    })
    const bulkQuery = `
        insert into tbl_post_media(post_uid, filename, thumbnail, type)
        values ?;
    `
    const a = await db_connection.query(bulkQuery, [fileData]);
    console.log(a,'디버깅용===================인서트 후')
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