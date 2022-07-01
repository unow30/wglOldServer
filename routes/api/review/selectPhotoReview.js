/**
 * Created by jongho on 2022. 06. 30.
 *
 * @swagger
 * /api/private/review/photo/list:
 *   get:
 *     summary: 상품 취소.반품.교환 목록
 *     tags: [Review]
 *     description: |
 *       path : /api/private/review/photo/list
 *
 *       * 상품 취소.반품.교환 목
 *
 *     parameters:
 *       - in: query
 *         name: product_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           상품 uid
 *      - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           offset (처음일 경우 0)
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/ProductOrderCancelListApi'
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
        //  logUtil.printUrlLog(req, `== function start ==================================`);
         req.paramBody = paramUtil.parse(req);
 
         checkParam(req);
 
         mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};
 
            req.innerBody['item'] = await query(req, db_connection);
            
            if(req.paramBody['offset']==0){
                req.innerBody['count'] = await countQuery(req, db_connection)
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
 
     return mysqlUtil.querySingle(db_connection
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
        , `select COUNT(uid) from tbl_photo_review where product_uid = ${req.paramBody['product_uid']}`
        , []
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