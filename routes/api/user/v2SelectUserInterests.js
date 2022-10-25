/**
 *
 * @swagger
 * /api/public/v2/user/interests/all:
 *   get:
 *     summary: 다른 유저 정보
 *     tags: [User]
 *     description: |
 *       path : /api/public/v2/user/interests/all
 *
 *       * 다른 유저 정보
 *       * all_interests 정보 {"uid": 1, "name": "식품"},{  "uid": 2,  "name": "반려동물"},{  "uid": 3,  "name": "패션/잡화"},{  "uid": 4,  "name": "인테리어"},{  "uid": 5,  "name": "뷰티/주얼리"},{  "uid": 6,  "name": "생활용품"}
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
         // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);
 
 
         mysqlUtil.connectPool(async function (db_connection) {
             req.innerBody = {};
 
             const allInterests = await querySelectAllInterest(req, db_connection)
             req.innerBody['all_interests'] = [...allInterests]
 
             sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
 
         }, function (err) {
             sendUtil.sendErrorPacket(req, res, err);
         });
 
     } catch (e) {
         let _err = errUtil.get(e);
         sendUtil.sendErrorPacket(req, res, _err);
     }
 }
 

 function querySelectAllInterest(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_interest_keyword_v2'
        , [
        ]
    );
}