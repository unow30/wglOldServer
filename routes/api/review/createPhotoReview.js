

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