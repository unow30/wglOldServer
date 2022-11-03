/**
 * Created by hyunhunhwang on 2021. 01. 02.
 *
 * @swagger
 * /api/private/v2/user/info/me:
 *   get:
 *     summary: 내 유저 정보
 *     tags: [User]
 *     description: |
 *       path : /api/private/v2/user/info/me
 *
 *       * 내 유저 정보
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
 
             //기존 쿼리가 길어서 func으로 만들기 불편하기 때문에 프로시저 호출
             let unreview_count = await querySelectProductConfirmCount(req, db_connection)
             let like_product_count = await querySelectLikeProductCount(req, db_connection)
             const interests = await querySelectInterest(req, db_connection)
             const allInterests = await querySelectAllInterest(req, db_connection)
             console.log(interests, '======================>>>>>>>>>>interests')

             req.innerBody['item']['unreview_count'] = unreview_count['count'];
             req.innerBody['item']['like_product_count'] = like_product_count['total_count'];
             req.innerBody['item']['my_interests'] = [...interests]
             req.innerBody['item']['all_interests'] = [...allInterests]
 
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
     // paramUtil.checkParam_noReturn(req.paramBody, 'signup_type');
     // paramUtil.checkParam_noReturn(req.paramBody, 'social_id');
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
             req.headers['user_uid'],
             // req.headers['access_token'],
         ]
     );
 }
 
 function querySelectProductConfirmCount(req, db_connection) {
     const _funcName = arguments.callee.name;
     //리뷰 미작성 상품 개수
     return mysqlUtil.querySingle(db_connection
         , 'call proc_select_confirm_list_count_v1'
         , [
             req.headers['user_uid']
         ]
     );
 }
 
 function querySelectLikeProductCount(req, db_connection) {
     const _funcName = arguments.callee.name;
     //좋아요 상품 개수 표시
     return mysqlUtil.querySingle(db_connection
         , 'call proc_select_like_product_list_count'
         , [
             req.headers['user_uid']
         ]
     );
 }

 function querySelectAllInterest(req, db_connection) {
    const _funcName = arguments.callee.name;
    //좋아요 상품 개수 표시
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_interest_keyword_v2'
        , [
        ]
    );
}

function querySelectInterest(req, db_connection) {
    const _funcName = arguments.callee.name;
    //좋아요 상품 개수 표시
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_my_interest_keyword_v2'
        , [
            req.headers['user_uid']
        ]
    );
}