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
 *       * limit 15 이므로 offset 15씩 증가
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

        mysqlUtil.connectPool(async function (db_connection) {
        req.innerBody = {};

        req.innerBody['item'] = await query(req, db_connection);

        if(req.paramBody['offset'] == 0){
            const letMeKnow = queryLetMeKnow(req, db_connection);
            const buyTogether = queryBuyTogether(req, db_connection);
            
            const [letMeKnowData, buyTogetherData] = await Promise.all([letMeKnow, buyTogether]);
            
            req.innerBody['best_post'] = {
                let_me_know: letMeKnowData,
                buy_together: buyTogetherData,
            }
        }
        

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

async function queryLetMeKnow(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_weggler_community_letmeknow_best_v2'
        , [
            req.headers['user_uid'],
        ]
    );
}

async function queryBuyTogether(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_weggler_community_buytogether_best_v2'
        , [
            req.headers['user_uid'],
        ]
    );
}