/**
 * Created by gunucklee on 2021. 08. 19.
 *
 * @swagger
 * /api/private/searchview/search/list/hashtag:
 *   get:
 *     summary: 해시태그 검색 정보
 *     tags: [SearchView]
 *     description: |
 *       path : /api/private/searchview/search/list/hashtag
 *
 *       * 영상 검색 정보
 *
 *     parameters:
 *       - in: query
 *         name: keyword
 *         required: true
 *         schema:
 *           type: string
 *           example: 테스트
 *         description: |
 *           해시태그 키워드입니다. (#는 제거하여 보냅니다)
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/SearchViewHashTag'
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
            req.innerBody['hash_tag_list'] = await queryHashTag(req, db_connection)
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

function queryHashTag(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call _dev_proc_select_search_list3'
        , [
            req.paramBody['keyword'],
            // req.paramBody['random_seed'],
            // req.paramBody['offset'],
        ]
    );
}


