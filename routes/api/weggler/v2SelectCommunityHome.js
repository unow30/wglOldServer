/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/weggler/community/home:
 *   get:
 *     summary: 커뮤니티 홈 피드 리스트
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/community/home
 *
 *       * 커뮤니티 게시글 리스트 및 인기게시글
 *       * limit 20 이므로 offset 20씩 증가
 *       * offset 0 일때만 인기게시글 4개 전달
 * 
 *     parameters:
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           offset
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
const dateUtil = require('../../../common/utils/dateUtil')


let file_name = fileUtil.name(__filename);
module.exports = function (req, res) {
    const _funcName = arguments.callee.name;
    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);

        mysqlUtil.connectPool(async function (db_connection) {
        req.innerBody = {};

        req.innerBody['item'] = await query(req, db_connection);
        
        //추천 위글러 추가되서 들어가야함

        sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });
    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

async function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_weggler_community_home_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['offset'],
        ]
    );
}