/**
 * Created by gunucklee on 2021. 09. 06.
 *
 * @swagger
 * /api/private/product/recent/viewed:
 *   get:
 *     summary: 최근 본 상품 목록
 *     tags: [Product]
 *     description: |
 *       path : /api/private/product/recent/viewed
 *
 *       * 최근 본 상품 목록
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/ProductFeed'
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
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            let count_data = await querySelectTotalCount(req, db_connection);
            req.innerBody['item'] = await querySelect(req, db_connection);
            req.innerBody['total_count'] = count_data['total_count'];

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

}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_recent_viewed_list'
        , [
            req.headers['user_uid'],
            req.paramBody['last_uid'],
        ]
    );
}

function querySelectTotalCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_recent_viewed_list_count'
        , [
            req.headers['user_uid'],
        ]
    );
}


