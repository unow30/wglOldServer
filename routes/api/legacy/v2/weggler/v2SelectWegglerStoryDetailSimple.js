/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/weggler/story/detail/simple:
 *   get:
 *     summary: 위글러 스토리 디테일 리스트 간이 페이지
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/story/detail/simple
 *
 *       * 위글러 스토리 디테일 리스트 간이 페이지
 * 
 *     parameters:
 *       - in: query
 *         name: target_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 212
 *         description: |
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           offset 10개씩 추가
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
         
         mysqlUtil.connectPool(async function (db_connection) {
         req.innerBody = {};
         req.innerBody['item'] = await query(req, db_connection);
 
         sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
         }, function (err) {
             sendUtil.sendErrorPacket(req, res, err);
         });
     } catch (e) {
         let _err = errUtil.get(e);
         sendUtil.sendErrorPacket(req, res, _err);
     }
 }
 
 async function query(req, db_connection) {
     const _funcName = arguments.callee.name;
 
     return mysqlUtil.querySingle(db_connection
         , 'call proc_weggler_story_detail_simple_v2'
         , [
             req.headers['user_uid'],
             req.paramBody['target_uid'],
             req.paramBody['offset'],
         ]
     );
 }