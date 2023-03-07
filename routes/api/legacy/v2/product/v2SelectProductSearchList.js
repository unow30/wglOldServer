/**
 *
 * @swagger
 * /api/public/v2/product/search/list:
 *   get:
 *     summary: 리뷰 가능한 상품 검색목록
 *     tags: [Product]
 *     description: |
 *       path : /api/public/v2/product/search/list
 *
 *       * 리뷰 가능한 상품 목록
 *       * 토탈 카운트는 offset 0에서만 보냅니다!
 *
 *     parameters:
 *       - in: query
 *         name: search_text
 *         required: true
 *         schema:
 *           type: string
 *           example: 고기
 *         description: 검색 키워드
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: limit 12 이므로 offset 12개씩 추가 
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

            req.innerBody['item'] = await querySelect(req, db_connection);

            if(req.paramBody['offset']==0){
                let count_data = await querySelectTotalCount(req, db_connection);
                req.innerBody['total_count'] = count_data['total_count'];
            }

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
    paramUtil.checkParam_return(req.paramBody, 'search_text');
    paramUtil.checkParam_return(req.paramBody, 'offset');
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
        , 'call proc_select_product_search_list_v2'
        , [
            req.paramBody['search_text'],
            req.paramBody['offset'],
        ]
    );
}

function querySelectTotalCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_product_search_list_count_v2'
        , [
            req.paramBody['search_text'],
        ]
    );
}