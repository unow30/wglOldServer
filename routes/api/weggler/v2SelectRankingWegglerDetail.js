/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/weggler/ranking/detail:
 *   get:
 *     summary: 랭킹 위글러 디테일 비디오 불러오기
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/ranking/detail
 *
 *       * 랭킹 위글러 불러오기
 * 
 *     parameters:
 *       - in: query
 *         name: user_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 212
 *         description: |
 *           해당 유저의 uid 
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
        
        mysqlUtil.connectPool(async function (db_connection) {
        req.innerBody = {};

        const videoInfo = await queryLankingWegglerDetail(req, db_connection); //핫 위글러 동영상 데이터

        req.innerBody['video_info'] = videoInfo;

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

function queryLankingWegglerDetail(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_ranking_weggler_detail_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['user_uid'],
        ]
    );
}