/**
 *
 * @swagger
 * /api/private/v2/user/info/other:
 *   get:
 *     summary: 다른 유저 정보
 *     tags: [User]
 *     description: |
 *       path : /api/private/v2/user/info/other
 *
 *       * 다른 유저 정보
 *
 *     parameters:
 *       - in: query
 *         name: user_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 유저 uid
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/UserApi'
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
 
 const errCode = require('../../../common/define/errCode');
 
 let file_name = fileUtil.name(__filename);
 
 module.exports = function (req, res) {
     const _funcName = arguments.callee.name;
 
     try {
         req.file_name = file_name;
         logUtil.printUrlLog(req, `== function start ==================================`);
         req.paramBody = paramUtil.parse(req);
         // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);
 
         checkParam(req);
 
         mysqlUtil.connectPool(async function (db_connection) {
             req.innerBody = {};
 
             req.innerBody['item'] = await querySelect(req, db_connection);
             if (!req.innerBody['item']) {
                 errUtil.createCall(errCode.empty, `회원가입하지 않은 유저입니다.`)
                 return
             }
 
             let follow_data = await queryFollowCheck(req, db_connection);
             req.innerBody['item']['is_follow'] = follow_data ? 1 : 0

             const interests = await querySelectInterest(req, db_connection);
             console.log(interests, '======================>>>>>>>>>>interests')
             req.innerBody['item']['my_interests'] = [...interests];
 
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
     paramUtil.checkParam_noReturn(req.paramBody, 'user_uid');
 }
 
 function deleteBody(req) {
     // delete req.innerBody['item']['latitude']
     // delete req.innerBody['item']['longitude']
     delete req.innerBody['item']['push_token']
     delete req.innerBody['item']['access_token']
 }
 
 function querySelect(req, db_connection) {
     const _funcName = arguments.callee.name;
 
     return mysqlUtil.querySingle(db_connection
         , 'call proc_select_user_info'
         , [
             req.paramBody['user_uid'],
             // req.headers['access_token'],
         ]
     );
 }
 
 function queryFollowCheck(req, db_connection) {
     const _funcName = arguments.callee.name;
 
     return mysqlUtil.querySingle(db_connection
         , 'call proc_select_follow_check'
         , [
             req.headers['user_uid'],
             req.paramBody['user_uid'],
 
         ]
     );
 }

 function querySelectInterest(req, db_connection) {
    const _funcName = arguments.callee.name;
    //좋아요 상품 개수 표시
    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_interest_keyword_v2'
        , [
            req.headers['user_uid']
        ]
    );
}