/**
 * Created by jongho
 *
 * 
 * @swagger
 * /api/private/v2/weggler/community/comment/list:
 *   get:
 *     summary: 위글러 커뮤니티 게시글 통합 댓글 리스트
 *     tags: [Weggler]
 *     description: |
 *       path : /api/private/v2/weggler/community/comment/list
 *
 *       * 댓글 목록
 *       * limit 20씩 이므로 offset 20씩 증가
 *
 *     parameters:
 *       - in: query
 *         name: target_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: 커뮤니티 게시물 uid
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
        req.paramBody['type'] = 3

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            const comments = await querySelect(req, db_connection);
            req.innerBody['comments'] = nestedCommentsParse(comments);

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
    paramUtil.checkParam_noReturn(req.paramBody, 'target_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'offset');
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_weggler_community_comment_list_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['target_uid'],
            req.paramBody['type'],
            req.paramBody['offset'],
        ]
    );
}

function nestedCommentsParse(comments) {
    const _funcName = arguments.callee.name;


    return comments.map(el =>{
        const comment = {
            ...el
        }
        comment.nested_comments = el.nested_comments
            ?
            el.nested_comments.split('@!@').map(item => {
                const parseItem = JSON.parse(item)
                parseItem.nested_comment_created_time = new Date(parseItem.nested_comment_created_time)
                console.log(parseItem)
                return parseItem
            })
            :
            []
        
        console.log(comment)
        return comment
    })
}