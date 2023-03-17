/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/weggler/ranking:
 *   get:
 *     summary: 랭킹 위글러 불러오기
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/ranking
 *
 *       * 랭킹 위글러 불러오기
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
const dateUtil = require('../../../../../common/utils/legacy/origin/dateUtil')


let file_name = fileUtil.name(__filename);
module.exports = function (req, res) {
    const _funcName = arguments.callee.name;
    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);

        mysqlUtil.connectPool(async function (db_connection) {
        req.innerBody = {};

        const lanking_weggler = await queryLankingWeggler(req, db_connection); //핫 위글러 리스트 및 동영상 데이터
   
        req.innerBody['lanking_weggler'] = lanking_weggler;

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

function queryLankingWeggler(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_ranking_weggler_list_v2'
        , [
            req.headers['user_uid'],
            // req.paramBody['product_uid'],
        ]
    );
}