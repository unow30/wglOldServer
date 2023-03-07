/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/weggler/iwrote/comment:
 *   get:
 *     summary: 내가 쓴 글 댓글 리스트
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/iwrote/comment
 *
 *       * 내가 쓴 글 댓글 리스트
 *       * limit 15 이므로 offset 15씩 증가
 * 
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           전체 게시물: 0, 알려줘요: 1, 궁금해요: 2
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           offset
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */
 const paramUtil = require('../../../../../common/utils/paramUtil');
 const fileUtil = require('../../../../../common/utils/fileUtil');
 const mysqlUtil = require('../../../../../common/utils/mysqlUtil');
 const sendUtil = require('../../../../../common/utils/sendUtil');
 const errUtil = require('../../../../../common/utils/errUtil');
 const logUtil = require('../../../../../common/utils/logUtil');
 
 
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
 
     return mysqlUtil.queryArray(db_connection
         , 'call proc_weggler_i_wrote_comment_list_v2'
         , [
             req.headers['user_uid'],
             req.paramBody['type'],
             req.paramBody['offset'],
         ]
     );
 }