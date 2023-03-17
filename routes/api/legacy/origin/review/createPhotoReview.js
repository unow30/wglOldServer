/**
 *
 * @swagger
 * /api/private/review/photo:
 *   post:
 *     summary: 상품의 포토리뷰 작성
 *     tags: [Review]
 *     description: |
 *       path : /api/private/review/photo
 *
 *       * 포토리뷰 작성
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           포토리뷰 작성
 *
 *         schema:
 *           type: object
 *           required:
 *             - content
 *             - product_uid
 *             - filename
 *             - order_product_uid
 *           properties:
 *             order_product_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 주문상품 uid
 *             filename:
 *               type: string
 *               example: asjdklwqnkmlasd.jpg
 *               description: |
 *                 리뷰 이미지
 *             content:
 *               type: string
 *               example: 이거 너무 맛있어요~~
 *               description: |
 *                 리뷰 내용
 *             product_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 상품 uid
 *
 *     responses:
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
 const fcmUtil = require('../../../../../common/utils/legacy/origin/fcmUtil');
 
 let file_name = fileUtil.name(__filename);
 
 module.exports = function (req, res) {
     const _funcName = arguments.callee.name;
 
     try{
         req.file_name = file_name;
         logUtil.printUrlLog(req, `== function start ==================================`);
         req.paramBody = paramUtil.parse(req);
 
         checkParam(req);
 
         mysqlUtil.connectPool( async function (db_connection) {
            req.paramBody.pointContent = '포토리뷰 작성 100포인트 지급';
            req.paramBody.pointAmount = 100;
            req.paramBody.pointType = 1;

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
     paramUtil.checkParam_noReturn(req.paramBody, 'order_product_uid');
 }
 
 function deleteBody(req) {
     // delete req.innerBody['item']['latitude']
 }
 
 function query(req, db_connection) {
     const _funcName = arguments.callee.name;
 
     return mysqlUtil.querySingle(db_connection
         , 'call proc_create_photo_review_v1'
         , [
             req.headers['user_uid'],
             req.paramBody['product_uid'],
             req.paramBody['content'],
             req.paramBody['filename'],
             req.paramBody['order_product_uid'],
             req.paramBody['pointContent'],
             req.paramBody['pointAmount'],
             req.paramBody['pointType'],
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