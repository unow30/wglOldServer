/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v1/searchview/list/all:
 *   get:
 *     summary: 모아보기 모든 화면 불러오기
 *     tags: [SearchView]
 *     description: |
 *      ## path : /api/private/v1/searchview/list/all
 *
 *       * ## 모아보기 모든 화면 불러오기 (인기 카테고리 목록 제외)
 *         * ### 광고이미지 목록
 *         * ### 신규상품 미리보기
 *         * ### 신규리뷰 미리보기
 *         * ### 위글딜 미리보기
 *         * ### 핫위글러 목록
 *         * ### 베스트 리뷰 목록
 *         * ### ~~인기 카테고리 목록~~ (기존 api를 실행해야 한다. searchview/popular/category/product/preview/list)
 *
 *     parameters:
 *       - in: query
 *         name: random_seed
 *         required: true
 *         schema:
 *           type: string
 *           example: 133q1234
 *         description: |
 *           검색할 때 필요한 랜덤 시드입니다.
 *
 *     responses:
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
            const last_order = queryLastOrder(req, db_connection); // 성공임박 공구
            const gongu_deal = queryGonguDeal(req, db_connection); // 지금뜨는 공구딜
            const gongu_deadline = queryGonguDeadline(req, db_connection); // 시간이 얼마 안남은 공구

            const [last_order_data, gongu_deal_data, gongu_deadline_data] = await Promise.all([last_order, gongu_deal, gongu_deadline])

            req.innerBody['last_order'] = last_order_data
            req.innerBody['gongu_deal'] = gongu_deal_data
            req.innerBody['gongu_deadline'] = gongu_deadline_data
     
            deleteBody(req);
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
     // paramUtil.checkParam_noReturn(req.paramBody, 'product_uid');
     // paramUtil.checkParam_noReturn(req.paramBody, 'latitude');
     // paramUtil.checkParam_noReturn(req.paramBody, 'longitude');
 }
 function deleteBody(req) {
     // delete req.innerBody['item']['latitude']
     // delete req.innerBody['item']['longitude']
     // delete req.innerBody['item']['push_token']
     // delete req.innerBody['item']['access_token']
 }
 function queryLastOrder(req, db_connection) {
     const _funcName = arguments.callee.name;
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_searchview_gongu_last_order_v1'
         , [
             req.headers['user_uid'],
             // req.paramBody['product_uid'],
         ]
     );
 }
 function queryGonguDeal(req, db_connection) {
     const _funcName = arguments.callee.name;
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_searchview_gongu_deal_v1'
         , [
             req.headers['user_uid']
         ]
     );
 }
 function queryGonguDeadline(req, db_connection) {
     const _funcName = arguments.callee.name;
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_searchview_gongu_deadline_v1'
         , [
             req.headers['user_uid']
         ]
     );
 }
