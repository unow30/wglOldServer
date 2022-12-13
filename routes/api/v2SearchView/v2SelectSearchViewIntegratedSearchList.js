/**
 * Created by jongho
 *
 * @swagger
 * /api/public/v2/searchview/integerated/search/list:
 *   get:
 *     summary: 통합 검색기능
 *     tags: [v2SearchView]
 *     description: |
 *       path : /api/public/v2/searchview/integerated/search/list
 *
 *       * 해시태그 검색 정보
 *
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *           example: 테스트
 *         description: |
 *           검색 키워드입니다.
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: int
 *           example: 0
 *         description: |
 *            offset
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
        //  logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            // req.innerBody['video_list'] = await querySelect(req, db_connection);
            req.innerBody['item'] = await querySelect(req, db_connection)

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
    paramUtil.checkParam_noReturn(req.paramBody, 'keyword');
    paramUtil.checkParam_noReturn(req.paramBody, 'offset');
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_integerated_search_list_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['keyword'],
            req.paramBody['offset'],
        ]
    );
}