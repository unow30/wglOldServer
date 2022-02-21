/**
 * Created by yunhokim on 2022. 02. 21.
 *
 * @swagger
 * /api/private/searchview/weggledeal/preview/list:
 *   get:
 *     summary: 검색 화면 - weggledeal 미리보기 목록
 *     tags: [SearchView]
 *     description: |
 *       path : /api/private/searchview/weggledeal/preview/list
 *
 *       * 검색 화면 - weggledeal 미리보기 목록
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
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await querySeller(req, db_connection);

            if( req.innerBody['item'] ){
                for( let idx in req.innerBody['item'] ){
                    req.innerBody['item'][idx]['list'] = await queryProduct(req, req.innerBody['item'][idx]['seller_uid'], db_connection)
                }
            }
            console.log(req.innerBody['item'])

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
}

function querySeller(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_weggledeal_seller_list'
        , [
             req.headers['user_uid']
            ,req.paramBody['random_seed']
        ]
    );
}

function queryProduct(req, seller_uid, db_connection) {
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
