/**
 * Created by hyunhunhwang on 2021. 01. 08.
 *
 * @swagger
 * /api/private/product/feed/list:
 *   get:
 *     summary: 피드 상품 목록
 *     tags: [Product]
 *     description: |
 *       path : /api/private/product/feed/list
 *
 *       * 피드 상품 목록
 *
 *     parameters:
 *       - in: query
 *         name: user_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: 상품 판매자 유저 uid
 *       - in: query
 *         name: category
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: |
 *           상품 카테고리
 *           * 1: 식품
 *           * 2: 뷰티
 *           * 4: 홈데코
 *           * 8: 패션잡화
 *           * 16: 반려동물
 *           * 32: 유아
 *           * 64: 스포츠레저
 *           * 128: 식물
 *         enum: [1,2,4,8,16,32,64,128]
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/ProductFeedListApi'
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

            req.innerBody['item'] = await querySelect(req, db_connection);

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
    paramUtil.checkParam_noReturn(req.paramBody, 'user_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'category');
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
        , 'call proc_select_product_feed_list'
        , [
            req.headers['user_uid'],
            req.paramBody['user_uid'],
            req.paramBody['category'],
        ]
    );
}

