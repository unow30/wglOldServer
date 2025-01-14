/**
 * 
 * Created by jongho
 * 
 * @swagger
 * /api/private/v2/user/my/activity/comment:
 *   get:
 *     summary: 내 활동 댓글 관련 정보
 *     tags: [User]
 *     description: |
 *       path : /api/private/v2/user/my/activity/comment
 *
 *       * 내 활동 댓글 관련 정보
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
 *         description: |
 *          1: 리뷰, 2: 커뮤니티
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

            if(req.paramBody['type'] == 1){
                req.innerBody['item'] = await querySelectReviewComment(req, db_connection)
            }
            else if(req.paramBody['type'] == 2){
                req.innerBody['item'] = await querySelectCommunityComment(req, db_connection)
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

function querySelectReviewComment(req, db_connection) {
    const _funcName = arguments.callee.name;
    
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_my_activity_review_comment_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['offset'],
        ]
    );
}

function querySelectCommunityComment(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_my_activity_community_comment_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['offset'],
        ]
    );
}