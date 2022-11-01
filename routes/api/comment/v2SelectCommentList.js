/**
 * Created by jongho
 *
 * 
 * @swagger
 * /api/public/v2/comment/list:
 *   get:
 *     summary: 포토, 비디오 리뷰 댓글 목록 및 리뷰 컨텐츠
 *     tags: [Comment]
 *     description: |
 *       path : /api/public/v2/comment/list
 *
 *       * 댓글 목록
 *       * limit 20씩 이므로 offset 20씩 증가
 *       * offset 0일 경우에만 target의 컨텐츠 보냄
 *       * comment type = 1: 비디오, 2: 포토
 *
 *     parameters:
 *       - in: query
 *         name: target_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: 영상 or 포토 리뷰 uid
 *       - in: query
 *         name: type
 *         default: 1
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: |
 *           1: 비디오, 2: 포토
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

            if(req.paramBody['offset']==0){
                req.innerBody['content'] = await queryTargetContent(req, db_connection);
            }
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
    paramUtil.checkParam_noReturn(req.paramBody, 'type');
    paramUtil.checkParam_noReturn(req.paramBody, 'offset');
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_comment_list_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['target_uid'],
            req.paramBody['type'],
            req.paramBody['offset'],
        ]
    );
}

function queryTargetContent(req, db_connection) {
    const _funcName = arguments.callee.name;

    let query = ''
    if(req.paramBody['type'] == 1){
        query = 'call proc_select_comment_video_content_v2'
    }
    if(req.paramBody['type'] == 2){
        query = 'call proc_select_comment_photo_content_v2'
    }

    return mysqlUtil.querySingle(db_connection
        , query
        , [
            req.paramBody['target_uid'],
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
                parseItem.created_time = new Date(parseItem.created_time)

                return parseItem
            })
            :
            []
        
        console.log(comment)
        return comment
    })
}