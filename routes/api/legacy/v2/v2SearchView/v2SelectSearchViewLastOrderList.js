/**
 * Created by yunhokim on 2022. 12. 06.
 *
 * @swagger
 * /api/public/v2/searchview/last/order/list:
 *   get:
 *     summary: 마감임박 공구딜 더보기
 *     tags: [v2SearchView]
 *     description: |
 *      ## path : /api/public/v2/searchview/last/order/list
 *
 *         * ## 마감임박 공구딜 더보기
 *         * ### 마감임박 공구딜 리스트
 *         * ### offset으로 패이징한다.
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
 *           페이지네이션 숫자
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

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};
            req.innerBody['item'] = await queryGonguDeal(req, db_connection); // 지금뜨는 공구딜


            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });
    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function queryGonguDeal(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_gongu_last_order_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['offset'],
        ]
    );
}