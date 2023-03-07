/**
 * Created by Jongho
 *
 * @swagger
 * /api/private/v2/point/history:
 *   get:
 *     summary: 포인트 히스토리
 *     tags: [Point]
 *     description: |
 *       path : /api/private/v2/point/history
 *
 *       * 포인트 히스토리
 *       * offset 0 일때만 토탈 포인트 보냅니다!
 * 
 *     parameters:
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: offset 12 씩 증가
 *       - in: query
 *         name: type
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *          0: 전체, 1: 지급, 2: 사용
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const paramUtil = require('../../../../../common/utils/paramUtil');
const fileUtil = require('../../../../../common/utils/fileUtil');
const mysqlUtil = require('../../../../../common/utils/mysqlUtil');
const sendUtil = require('../../../../../common/utils/sendUtil');
const errUtil = require('../../../../../common/utils/errUtil');
const logUtil = require('../../../../../common/utils/logUtil');

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

            if(req.paramBody['offset'] == 0){
                const pointResult = await querySelectAll(req, db_connection);
                req.innerBody['total_point'] = pointResult.total_point;
            }

            req.innerBody['item'] = await querySelectPointHistory(req, db_connection);

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

function querySelectAll(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_point_all_v2'
        , [
            req.headers['user_uid'],
        ]
    );
}

function querySelectPointHistory(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_point_history_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['type'],
            req.paramBody['offset']
        ]
    );
}