/**
 * Created by jongho
 *
 * @swagger
 * /api/public/v1/searchview/list/gongudeal:
 *   get:
 *     summary: 공구딜 전체보기
 *     tags: [SearchView]
 *     description: |
 *      ## path : /api/public/v1/searchview/list/gongudeal
 *
 *       * ## 공구딜 전체보기 
 *         * ### 지금뜨는 공구딜 목록
 *
 *     parameters:
 *       - in: query
 *         name: category
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: |
 *           상품 카테고리
 *           * 1: 식품
 *           * 2: 뷰티, 주얼리
 *           * 4: 인테리어
 *           * 8: 패션,잡화
 *           * 16: 반려동물
 *           * 32: 생활용품
 *         enum: [1,2,4,8,16,32]
 *       - in: query
 *         name: random_seed
 *         required: true
 *         schema:
 *           type: string
 *           example: 133q1234
 *         description: |
 *           검색할 때 필요한 랜덤 시드입니다.
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: int
 *           example: 0
 *         description: |
 *           12개 단위
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
            req.innerBody['gongu_deal'] = await queryGonguDeal(req, db_connection); // 지금뜨는 공구딜


            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
         }, function (err) {
             sendUtil.sendErrorPacket(req, res, err);
         });
     } catch (e) {
         let _err = errUtil.get(e);
         sendUtil.sendErrorPacket(req, res, _err);
     }
 }

 function queryGonguDeal(req, db_connection) {
     const _funcName = arguments.callee.name;
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_searchview_gongu_deal_v1'
         , [
             req.headers['user_uid'],
             req.paramBody['category'],
             req.paramBody['random_seed'],
             req.paramBody['offset'],
         ]
     );
 }