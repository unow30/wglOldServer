/**
 * Created by yunhokim on 2021. 11. 03.
 *
 * @swagger
 * /api/public/searchview/search/list/user:
 *   get:
 *     summary: 사용자 검색 정보
 *     tags: [SearchView]
 *     description: |
 *       path : /api/public/searchview/search/list/user
 *
 *       * 사용자 검색 정보
 *
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *           example:
 *         description: 검색 키워드(사용자(닉네임) 검색)
 *       - in: query
 *         name: last_uid
 *         required: true
 *         schema:
 *           type: int
 *           example: 0
 *         description: |
 *            목록 마지막 uid (처음일 경우 0)
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/SearchViewUserSearchListApi'
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
            req.innerBody['user_list'] = await queryUser(req, db_connection)
            const countResult = await queryUserCount(req, db_connection)
            req.innerBody['count'] = countResult.count
            
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
    // paramUtil.checkParam_noReturn(req.paramBody, 'video_uid');
    // paramUtil.checkParam_noReturn(req.paramBody, 'social_id');
}

function deleteBody(req) {
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

// function querySelect(req, db_connection) {
//     const _funcName = arguments.callee.name;
//
//     return mysqlUtil.queryArray(db_connection
//         , 'call proc_select_searchview_search_list'
//         , [
//             req.headers['user_uid'],
//             req.paramBody['keyword'],
//             req.paramBody['random_seed'],
//             req.paramBody['offset'],
//         ]
//     );
// }

function queryUser(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_user_search_list'
        , [
            req.headers['user_uid'],
            req.paramBody['keyword'],
            req.paramBody['last_uid'],
        ]
    );
}

function queryUserCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_searchview_user_search_count_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['keyword'],
        ]
    );
}