/**
 * Created by hyunhunhwang on 2021. 01. 17.
 *
 * @swagger
 * /api/private/searchview:
 *   get:
 *     summary: 검색 화면 모든 정보
 *     tags: [SearchView]
 *     description: |
 *       path : /api/private/searchview
 *
 *       * 검색 화면 모든 정보
 *       * best의 경우 별도의 api 사용( /api/private/searchview/recommend/list )
 *
 *     parameters:
 *       - in: query
 *         name: latitude
 *         default: 37.536977
 *         required: true
 *         schema:
 *           type: number
 *           example: 37.536977
 *         description: 위도 ( ex - 37.500167 )
 *       - in: query
 *         name: longitude
 *         default: 126.955242
 *         required: true
 *         schema:
 *           type: number
 *           example: 126.955242
 *         description: 경도 ( ex - 126.955242 )
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/ProductDetail'
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

            req.innerBody['ad_list'] = await queryADList(req, db_connection);

            req.innerBody['popular_list'] = await queryPopularList(req, db_connection);
            req.innerBody['nearby_list'] = await queryNearbyList(req, db_connection);

            req.innerBody['weggle_deal_list'] = await queryWeggleDealList(req, db_connection);

            req.innerBody['seller_list'] = await querySellerList(req, db_connection);

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
    paramUtil.checkParam_noReturn(req.paramBody, 'latitude');
    paramUtil.checkParam_noReturn(req.paramBody, 'longitude');
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

function queryPopularList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_popular_list'
        , [
            // req.headers['user_uid'],
            req.headers['user_uid'],
            // req.paramBody['product_uid'],
            // 2,
        ]
    );
}

function queryNearbyList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_nearby_list'
        , [
            req.headers['user_uid'],
            req.paramBody['latitude'],
            req.paramBody['longitude'],
        ]
    );
}

function queryWeggleDealList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_weggle_deal_list'
        , [
            // 2,
        ]
    );
}

function querySellerList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_seller_list'
        , [
            // req.paramBody['product_uid'],
            // 2,
        ]
    );
}
