/**
 *
 * @swagger
 * /api/private/v2/weggler/community/hacks/detail:
 *   get:
 *     summary: 커뮤니티 끄적끄적 게시물 상세페이지
 *     tags: [Weggler]
 *     description: |
 *       path : /api/private/v2/weggler/community/hacks/detail
 *
 *       * 커뮤니티 위글꿀팁 게시물 상세페이지
 *       * type: 1: 끄적끄적, 2: 위글꿀팁, 3: 궁금해요
 *       * 댓글 리스트를 위한 offset 입니다. 게시물 데이터는 offset 0 일때만 보냅니다. 
 *
 *     parameters:
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           offset
 *       - in: query
 *         name: post_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: |
 *           post_uid
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
         req.paramBody['type'] = 2 // 1: 끄적끄적, 2: 위글꿀팁, 3: 궁금해요
         // 미완성 상태 위글러 픽스 나면 추후에 프로시저 확인해 봐야함
         mysqlUtil.connectPool( async function (db_connection) {
             req.innerBody = {};
 
             if(req.paramBody['offset']==0){
                 req.innerBody['item'] = await query(req, db_connection);
             }
             req.innerBody['comments'] = await queryComments(req, db_connection);
 
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
     paramUtil.checkParam_noReturn(req.paramBody, 'offset');
     paramUtil.checkParam_noReturn(req.paramBody, 'post_uid');
 }
 
 function deleteBody(req) {
     // delete req.innerBody['item']['latitude']
 }
 
 function query(req, db_connection) {
     const _funcName = arguments.callee.name;
 
     return mysqlUtil.querySingle(db_connection
         , 'call proc_select_community_hacks_detail_v2'
         , [
             req.headers['user_uid'],
             req.paramBody['post_uid'],
         ]
     );
 }
 
 function queryComments(req, db_connection) {
     const _funcName = arguments.callee.name;
 
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_community_comment_v2'
         , [
             req.headers['user_uid'],
             req.paramBody['post_uid'],
             req.paramBody['offset'],
         ]
     );
 }