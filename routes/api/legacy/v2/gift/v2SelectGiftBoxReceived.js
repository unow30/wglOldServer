/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/gift/box/received:
 *   get:
 *     summary: 받은 선물 정보
 *     tags: [Gift]
 *     description: |
 *       path : /api/private/v2/gift/box/received
 *
 *       * 받은 선물 정보
 *
 *     parameters:
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           offset 12씩 증가
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
 
 let file_name = fileUtil.name(__filename);
 
 module.exports = function (req, res) {
     const _funcName = arguments.callee.name;
 
     try {
         req.file_name = file_name;
         logUtil.printUrlLog(req, `== function start ==================================`);
         req.paramBody = paramUtil.parse(req);
 
         checkParam(req);
 
         mysqlUtil.connectPool(async function (db_connection) {
             req.innerBody = {};
 
             req.innerBody['item'] = await querySelect(req, db_connection);
 
             deleteBody(req)
             sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
 
         }, function (err) {
             sendUtil.sendErrorPacket(req, res, err);
         });
 
     } catch (e) {
         let _err = errUtil.get(e);
         sendUtil.sendErrorPacket(req, res, _err);
     }
 }
 
 function checkParam(req) {
 }
 
 function deleteBody(req) {
 }
 
 function querySelect(req, db_connection) {
     const _funcName = arguments.callee.name;
 
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_gift_box_received_v2'
         , [
             req.headers['user_uid'],
             req.paramBody['offset'],
         ]
     );
 }