/**
 * Created by gunucklee on 2022. 02. 14.
 *
 * @swagger
 * /api/private/searchview/new/product/list:
 *   get:
 *     summary: 검색 화면 - New Product(신규 상품) 목록
 *     tags: [SearchView]
 *     description: |
 *       path : /api/private/searchview/new/product/list
 *
 *       * 검색 화면 - New Product(신규 상품) 목록
 *
 *     parameters:
 *        - in: query
 *          name: last_uid
 *          default: 0
 *          required: true
 *          schema:
 *            type: number
 *            example: 0
 *          description: |
 *            목록 마지막 uid (처음일 경우 0)
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
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            let count_data = await querySelectCount(req, db_connection);
            req.innerBody['item'] = await querySelect(req, db_connection);
            req.innerBody['total_count'] = count_data['total_count'];

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
}

function deleteBody(req) {
}

function querySelectCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_searchview_new_product_list_count'
        , [
            req.headers['user_uid']
        ]
    );
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_new_product_list'
        , [
            req.headers['user_uid']
          , req.paramBody['last_uid']
        ]
    );
}


