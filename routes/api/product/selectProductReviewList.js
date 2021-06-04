/**
 * Created by hyunhunhwang on 2021. 01. 17.
 *
 * @swagger
 * /api/private/product/review/list:
 *   get:
 *     summary: 리뷰 가능한 상품 목록
 *     tags: [Product]
 *     description: |
 *       path : /api/private/product/review/list
 *
 *       * 리뷰 가능한 상품 목록
 *
 *     parameters:
 *       - in: query
 *         name: search_text
 *         required: false
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *       - in: query
 *         name: category
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: |
 *           상품 카테고리
 *           * 1: 수제 먹거리
 *           * 2: 음료
 *           * 4: 인테리어 소품
 *           * 8: 악세사리
 *           * 16: 휴대폰 주변기기
 *           * 32: 비누/캔들
 *           * 64: 가죽 공예
 *           * 128: 꽃
 *           * 256: 반려견
 *           * 65535: 전체
 *         enum: [1,2,4,8,16,32,64,128,256,65535]
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
    paramUtil.checkParam_noReturn(req.paramBody, 'category');
    paramUtil.checkParam_noReturn(req.paramBody, 'last_uid');
    if( !paramUtil.checkParam_return(req.paramBody, 'search_text') ){
        req.paramBody['search_text'] = null
    }

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
        , 'call proc_select_product_review_list'
        , [
            req.paramBody['category'],
            req.paramBody['search_text'],
            req.paramBody['last_uid'],
        ]
    );
}

function querySelectTotalCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_product_review_list_count'
        , [
            req.paramBody['category'],
            req.paramBody['search_text'],
        ]
    );
}


