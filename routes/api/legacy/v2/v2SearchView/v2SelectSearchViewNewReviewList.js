/**
 * Created by yunhokim on 2022. 12. 07.
 *
 * @swagger
 * /api/public/v2/searchview/new/review/list:
 *   get:
 *     summary: 검색 화면 - New Review(신규 리뷰영상) 목록
 *     tags: [v2SearchView]
 *     description: |
 *       path : /api/public/v2/searchview/new/review/list
 *
 *       * ## 검색 화면 - New Review(신규 리뷰영상) 목록
 *       * ### offset으로 패이징한다.
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
 *           페이지 시작 값을 넣어주시면 됩니다. 호출당 Limit 12
 *           offset 0: 0~11
 *           offset 12: 12~23
 *           offset 24: 24~35
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

            // let count_data = await querySelectCount(req, db_connection);
            req.innerBody['item'] = await queryNewReviewPreviewList(req, db_connection);
            // req.innerBody['total_count'] = count_data['total_count'];

            deleteBody(req);
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

function querySelectCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_searchview_new_review_list_count'
        , [
            req.headers['user_uid']
        ]
    );
}

function queryNewReviewPreviewList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_new_review_preview_list_v2'
        , [
            req.headers['user_uid']
            , req.paramBody['offset']
        ]
    );
}


