/**
 * Created by gunucklee on 2022. 02. 14.
 *
 * @swagger
 * /api/public/dev/searchview/new/review/list:
 *   get:
 *     summary: 검색 화면 - New Review(신규 리뷰영상) 목록
 *     tags: [Dev]
 *     description: |
 *       path : /api/public/dev/searchview/new/review/list
 *
 *       * 검색 화면 - New Review(신규 리뷰영상) 목록
 *
 *     parameters:
 *        - in: query
 *          name: offset
 *          default: 0
 *          required: true
 *          schema:
 *            type: number
 *            example: 0
 *          description: |
 *            목록 오프셋
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
        console.log(12312312312344444)
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            let count_data = await querySelectCount(req, db_connection);
            req.innerBody['item'] = await querySelect(req, db_connection);
            req.innerBody['total_count'] = count_data['total_count'];

            let date = new Date()
            date = date.setMonth(date.getMonth()-6)
            if(date > req.innerBody.item[0].created_time || !req.innerBody.item[0].created_time){

                const err = new Error('더이상 최신 데이터가 없습니다.')
                err.code = 400

                return sendUtil.sendErrorPacket(req, res, err);
            }
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

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_new_review_list2'
        , [
            req.headers['user_uid']
            , req.paramBody['offset']??0
        ]
    );
}