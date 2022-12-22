/**
 * 
 * Created by jongho
 * 
 * @swagger
 * /api/private/v2/user/my/activity/post:
 *   get:
 *     summary: 내 활동 게시글 관련 정보
 *     tags: [Weggler]
 *     description: |
 *       path : /api/private/v2/user/my/activity/post
 *
 *       * 내 활동 게시글 관련 정보
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
 *           페이지 시작 값을 넣어주시면 됩니다. Limit 12 offset 0부터
 *       - in: query
 *         name: type
 *         default: 1
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: 1: 리뷰, 2: 커뮤니티
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
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            if(req.paramBody['type'] == 1){
                req.innerBody['item'] = await querySelectReview(req, db_connection)
            }
            else if(req.paramBody['type'] == 2){
                req.innerBody['item'] = await querySelectCommunity(req, db_connection)
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

function checkParam(req) {
    paramUtil.checkParam_noReturn(req.paramBody, 'type');
    paramUtil.checkParam_noReturn(req.paramBody, 'offset');
}

function querySelectReview(req, db_connection) {
    const _funcName = arguments.callee.name;
    
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_my_activity_review_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['offset'],
        ]
    );
}

function querySelectCommunity(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_my_activity_community_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['offset'],
        ]
    );
}