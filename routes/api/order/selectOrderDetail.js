/**
 * Created by hyunhunhwang on 2021. 02. 16.
 *
 * @swagger
 * /api/private/order/detail:
 *   get:
 *     summary: 상품 구매 상세
 *     tags: [Order]
 *     description: |
 *       path : /api/private/order/detail
 *
 *       * 상품 구매 상세
 *
 *     parameters:
 *       - in: query
 *         name: order_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: |
 *           구매 uid
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/Order'
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

            req.innerBody['item'] = await querySelect(req, db_connection);
            if( req.innerBody['item'] ){
                for( let idx in req.innerBody['item'] ){
                    req.innerBody['item'][idx]['product_item'] = JSON.parse(req.innerBody['item'][idx]['product_item'])
                }
            }

            // req.innerBody['order_product_list'] = await querySelectList(req, db_connection);

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
    paramUtil.checkParam_noReturn(req.paramBody, 'order_uid');
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

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_order_detail'
        , [
            req.headers['user_uid'],
            req.paramBody['order_uid'],
        ]
    );
}

function querySelectList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_order_product_list'
        , [
            req.headers['user_uid'],
            req.paramBody['order_uid'],
        ]
    );
}
