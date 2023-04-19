/**
 * Created by yunhokim on 2022. 02. 16.
 *
 * @swagger
 * /api/private/searchview/ad/list:
 *   get:
 *     summary: 검색 화면 광고(배너)이미지
 *     tags: [SearchView]
 *     description: |
 *       path : /api/private/searchview/ad/list
 *
 *       * 검색 화면 광고(배너)이미지
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