/**
 * Created by yunhokim on 2022. 03. 10.
 *
 * @swagger
 * /api/private/searchview/list/all:
 *   get:
 *     summary: 모아보기 모든 화면 불러오기
 *     tags: [SearchView]
 *     description: |
 *      ## path : /api/private/searchview/list/all
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
         // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);
         checkParam(req);
         mysqlUtil.connectPool(async function (db_connection) {
             req.innerBody = {};
             req.innerBody['ad_list'] = await queryADList(req, db_connection);
             req.innerBody['new_product_preview_list'] = await queryNewProductPreviewList(req, db_connection);
             req.innerBody['new_review_preview_list'] = await queryNewReviewPreviewList(req, db_connection);
             //위글딜 프리뷰 한 프로시저로 도전
             req.innerBody['weggle_deal_preview_list'] = await queryWeggledealSeller(req, db_connection);
             if( req.innerBody['weggle_deal_preview_list'] ){
                 for( let idx in req.innerBody['weggle_deal_preview_list'] ){
                     req.innerBody['weggle_deal_preview_list'][idx]['list'] = await queryWeggledealProduct(req, req.innerBody['weggle_deal_preview_list'][idx]['seller_uid'], db_connection)
                 }
             }
 
             //핫위글러 한 프로시저로 도전
             req.innerBody['hot_weggler'] = await queryHotWegglerUser(req, db_connection);
             if( req.innerBody['hot_weggler'] ){
                 for( let idx in req.innerBody['hot_weggler'] ){
                     req.innerBody['hot_weggler'][idx]['list'] = await queryHotWegglerVideo(req, req.innerBody['hot_weggler'][idx]['user_uid'], db_connection)
                 }
             }
             // req.innerBody['category_product_preview_list'] = await queryCategoryProductPreviewList(req, db_connection);
             req.innerBody['best_review_list'] = await queryBestReviewList(req, db_connection);
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
 function queryADList(req, db_connection) {
     const _funcName = arguments.callee.name;
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_searchview_ad_list'
         , [
             req.headers['user_uid'],
             // req.paramBody['product_uid'],
         ]
     );
 }
 function queryNewProductPreviewList(req, db_connection) {
     const _funcName = arguments.callee.name;
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_searchview_new_product_preview_list'
         , [
             req.headers['user_uid']
         ]
     );
 }
 function queryNewReviewPreviewList(req, db_connection) {
     const _funcName = arguments.callee.name;
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_searchview_new_review_preview_list'
         , [
             req.headers['user_uid']
         ]
     );
 }
 function queryWeggledealSeller(req, db_connection) {
     const _funcName = arguments.callee.name;
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_searchview_weggledeal_seller_list'
         , [
             req.headers['user_uid']
             ,req.paramBody['random_seed']
         ]
     );
 }
 function queryWeggledealProduct(req, seller_uid, db_connection) {
     const _funcName = arguments.callee.name;
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_searchview_weggledeal_product_list'
         , [
             req.headers['user_uid']
             , seller_uid
             , req.paramBody['random_seed']
         ]
     );
 }
 function queryHotWegglerUser(req, db_connection) {
     const _funcName = arguments.callee.name;
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_hot_weggler_user_thumbnail_list'
         , [
             req.headers['user_uid'],
             req.paramBody['random_seed'],
         ]
     );
 }
 function queryHotWegglerVideo(req, hot_weggler_uid, db_connection) {
     const _funcName = arguments.callee.name;
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_hot_weggler_video_thumbnail_list'
         , [
             req.headers['user_uid'],
             hot_weggler_uid
         ]
     );
 }
 function queryCategoryProductPreviewList(req, db_connection) {
     const _funcName = arguments.callee.name;
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_popular_category_product_preview_list'
         , [
             req.headers['user_uid'],
             req.paramBody['category'],
             req.paramBody['random_seed'],
         ]
     );
 }
 function queryBestReviewList(req, db_connection) {
     const _funcName = arguments.callee.name;
     return mysqlUtil.queryArray(db_connection
         , 'call proc_select_searchview_best_review_list'
         , [
             req.headers['user_uid']
             ,req.paramBody['random_seed']
         ]
     );
 }