/**
 * Created by hyunhunhwang on 2021. 02. 15.
 *
 * @swagger
 * /api/private/order/list:
 *   get:
 *     summary: 상품 구매 목록
 *     tags: [Order]
 *     description: |
 *       path : /api/private/order/list
 *
 *       * 상품 구매 목록
 *
 *     parameters:
 *       - in: query
 *         name: last_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           목록 마지막 uid (처음일 경우 0)
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/OrderListApi'
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

            // let count_data = await querySelectTotalCount(req, db_connection);
            req.innerBody['item'] = await querySelect(req, db_connection);
            req.innerBody['item'] = createJSONArray(req.innerBody['item'])
            req.innerBody['total_count'] = 0;

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

function createJSONArray(item){
    if( item ){
        for( let idx in item ){
            item[idx]['order_product_list'] = JSON.parse(item[idx]['order_product_list'])
        }
    }
    return item;
}


function checkParam(req) {
    paramUtil.checkParam_noReturn(req.paramBody, 'last_uid');
    // paramUtil.checkParam_noReturn(req.paramBody, 'product_uid');
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
        , 'call proc_select_order_list'
        , [
            req.headers['user_uid'],
            req.paramBody['last_uid'],
        ]
    );
}

function querySelectTotalCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_order_list_count'
        , [
            req.headers['user_uid'],
        ]
    );
}


