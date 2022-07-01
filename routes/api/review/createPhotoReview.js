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
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/VideoReviewApi'
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
         , 'call proc_create_photo_review'
         , [
             req.headers['user_uid'],
             req.paramBody['product_uid'],
             req.paramBody['content'],
             req.paramBody['filename'],
         ]
     );
 }
 
//  function queryInsertFCM(data, db_connection){
 
//      return mysqlUtil.querySingle(db_connection
//          ,'call proc_create_fcm_data'
//          , [
//              data['user_uid'],
//              data['alarm_type'],
//              data['title'],
//              data['message'],
//              data['video_uid'] == null? 0 : data['video_uid'],
//              data['target_uid'] == null? 0 : data['target_uid'],
//              data['icon_filename']
//          ]
//      );
//  }
 
//  function queryAlertComment(req, db_connection){
 
//      return mysqlUtil.querySingle(db_connection
//          , 'call proc_select_alert_list'
//          , [
//              req.innerBody['item']['seller_uid']
//          ]
//      )
//  }