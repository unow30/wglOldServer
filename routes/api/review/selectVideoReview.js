/**
 *
 * @swagger
 * /api/private/review/video:
 *   get:
 *     summary: 상품의 영상리뷰 가져오기
 *     tags: [Review]
 *     description: |
 *       path : /api/private/review/video
 *
 *       * 상품 영상리뷰 가져오기
 *
 *     parameters:
 *       - in: query
 *         name: product_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: |
 *           상품 고유번호
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           페이지 시작 값을 넣어주시면 됩니다. Limit 12
 *           offset 0: 0~11
 *           offset 12: 12~23
 *           offset 24: 24~35
 *     responses:
 *       400:
 *         description: 에러 코드 400
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
                const data = await countQuery(req, db_connection);
                req.innerBody['count'] = data.video_count;
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
     paramUtil.checkParam_noReturn(req.paramBody, 'product_uid');
     paramUtil.checkParam_noReturn(req.paramBody, 'offset');
 }
 
 function query(req, db_connection) {
     const _funcName = arguments.callee.name;
 
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_detail_video_review_list_v1'
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
        , 'call proc_select_detail_video_review_list_count_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
        ]
    );
}