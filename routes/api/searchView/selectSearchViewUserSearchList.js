/**
 * Created by yunhokim on 2021. 11. 03.
 *
 * @swagger
 * /api/private/searchview/search/list/user:
 *   get:
 *     summary: 사용자 검색 정보
 *     tags: [SearchView]
 *     description: |
 *       path : /api/private/searchview/search/list/user
 *
 *       * 사용자 검색 정보
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
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           페이지 시작 값을 넣어주시면 됩니다. Limit 30
 *           offset 0: 0~30
 *           offset 30: 30~60
 *           offset 60: 60~90
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *           example:
 *         description: 검색 키워드(사용자(닉네임) 검색)
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/SearchViewUser'
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

            // req.innerBody['video_list'] = await querySelect(req, db_connection);
            req.innerBody['user_list'] = await queryUser(req, db_connection)
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

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_search_list'
        , [
            req.headers['user_uid'],
            req.paramBody['keyword'],
            req.paramBody['random_seed'],
            req.paramBody['offset'],
        ]
    );
}

function queryUser(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call _dev_proc_select_search_list4'
        , [
            req.paramBody['keyword'],
            req.paramBody['last_uid'],
        ]
    );
}


