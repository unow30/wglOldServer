/**
 * 
 * Created by jongho
 * 
 * @swagger
 * /api/private/v2/weggler/search/community/post:
 *   get:
 *     summary: 커뮤니티 게시글 검색 정보
 *     tags: [Weggler]
 *     description: |
 *       path : /api/private/v2/weggler/search/community/post
 *
 *       * 커뮤니티 게시글 검색 정보
 *       * offset 0일때만 count값 보냅니다.
 *
 *     parameters:
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           페이지 시작 값을 넣어주시면 됩니다. Limit 12 offset 0부터
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *           example:
 *         description: 검색 키워드(상품명 검색)
 *
 *     responses:
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
            if(req.paramBody['offset'] == 0 ){
                const result = await querySelectCount(req, db_connection);
                req.innerBody['count'] = result.count
            }

            req.innerBody['item'] = await querySelect(req, db_connection);

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
        , 'call proc_select_search_community_post_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['keyword'],
            req.paramBody['offset'],
        ]
    );
}

function querySelectCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_search_community_post_count_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['keyword'],
        ]
    );
}