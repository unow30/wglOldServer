

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
     console.log(1234)
     try{
         req.file_name = file_name;
        //  logUtil.printUrlLog(req, `== function start ==================================`);
         req.paramBody = paramUtil.parse(req);
 
         checkParam(req);
 
         mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};
 
            req.innerBody['item'] = await query(req, db_connection);
            
            if(req.paramBody['offset']==0){
                const data = await countQuery(req, db_connection);
                req.innerBody['count'] = data.count;
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
     paramUtil.checkParam_noReturn(req.paramBody, 'product_uid');
     paramUtil.checkParam_noReturn(req.paramBody, 'offset');
 }
 
 function deleteBody(req) {
     // delete req.innerBody['item']['latitude']
 }
 
 function query(req, db_connection) {
     const _funcName = arguments.callee.name;
 
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_photo_review'
         , [
             req.headers['user_uid'],
             req.paramBody['product_uid'],
             req.paramBody['offset']
         ]
     );
 }

 function countQuery(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_photo_review_count'
        , [
            req.paramBody['product_uid'],
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