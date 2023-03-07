/**
 * Created by yunhokim on 2022. 05. 11.
 *
 * @swagger
 * /api/public/promotion/list/all:
 *   get:
 *     summary: 모든 프로모션 화면 미리보기
 *     tags: [Promotion]
 *     description: |
 *      ## path : /api/public/promotion/list/all
 *
 *       * ## 모든 프로모션 화면 미리보기
 *         * ### 큰 배너 이미지 가져오기
 *         * ### 프로모션 판매자 uid와 작은배너 uid 가져오기
 *         * ### 프로모션 판매자 uid를 반복해서 미리보기 영상 목록 가져오기
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
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};
            /*큰 배너 이미지 가져오기*/
            req.innerBody['big_banner'] = await queryBigBannerList(req, db_connection);

            /*프로모션 판매자 uid와 작은배너 uid 가져오기*/
            req.innerBody['brand_list'] = await queryUserSmallBannerList(req, db_connection);
            // [{userUid: 1, smallBanner:abc.png },{userUid: 2, smallBanner: def.png}]

            let idx = 0
            for(let ele of req.innerBody['brand_list']){
                let list = await queryPromotionPreviewList(req, ele['user_uid'] ,db_connection)
                req.innerBody['brand_list'][idx]['list'] = list
                idx++
            }
            //item: [{userUid: 1, smallBanner: abc.png, list:[{},{}] },
            //       {userUid: 2, smallBanner: def.png, list:[{},{}] }]

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

function queryBigBannerList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_promotion_big_banner_list'
        , [
            req.headers['user_uid']
        ]
    );
}

function queryUserSmallBannerList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
            , 'call proc_select_promotion_user_banner_list'
        , [
            req.headers['user_uid']
        ]
    );
}


function queryPromotionPreviewList(req, brand_uid, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_promotion_preview_list'
        , [
            req.headers['user_uid']
            ,brand_uid
        ]
    );
}