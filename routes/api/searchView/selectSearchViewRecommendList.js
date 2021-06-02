/**
 * Created by hyunhunhwang on 2021. 01. 21.
 *
 * @swagger
 * /api/private/searchview/recommend/list:
 *   get:
 *     summary: 검색 화면 - Best(추천 상품) 목록
 *     tags: [SearchView]
 *     description: |
 *       path : /api/private/searchview/recommend/list
 *
 *       * 검색 화면 - Best(추천 상품) 목록
 *
 *     parameters:
 *       - in: query
 *         name: user_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 유저 uid
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: |
 *           상품 카테고리
 *           * 1 : 수제 먹거리
 *           * 2 : 음료
 *           * 4 : 인테리어 소품
 *           * 8 : 악세사리
 *           * 16 : 휴대폰 주변기기
 *           * 32 : 비누/캔들
 *           * 64 : 가죽 공예
 *           * 128 : 꽃
 *           * 256 : 반려견
 *         enum: [1,2,4,8,16,32,64,128,256]
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Product'
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
        , 'call proc_select_searchview_recommend_list'
        , [
            req.paramBody['user_uid'],
            req.paramBody['category'],
        ]
    );
}


