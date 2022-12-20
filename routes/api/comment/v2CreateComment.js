/**
 *
 * @swagger
 * /api/private/v2/comment:
 *   post:
 *     summary: 댓글 작성
 *     tags: [Comment]
 *     description: |
 *       path : /api/private/v2/comment
 *
 *       * 댓글 작성
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           댓글 작성
 *         schema:
 *           type: object
 *           required:
 *             - video_uid
 *             - content
 *           properties:
 *             target_uid:
 *               type: number
 *               description: |
 *                 영상, 포토리뷰 uid
 *             content:
 *               type: string
 *               description: |
 *                 내용
 *             type:
 *               type: number
 *               description: |
 *                 1: 비디오 리뷰, 2: 포토 리뷰 3: 위글러 커뮤니티 게시글
 *
 *           example:
 *             target_uid: 1
 *             content: 댓글 입니다.
 *             type: 1
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
const jwtUtil = require('../../../common/utils/jwtUtil');
const fcmUtil = require('../../../common/utils/fcmUtil');

const errCode = require('../../../common/define/errCode');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            if(req.paramBody['type']=== 1){
                req.paramBody['video_uid'] = req.paramBody['target_uid']

                req.innerBody['item'] = await query(req, db_connection);
                let alertList = await queryAlertComment(req, db_connection);
                console.log(alertList);
                if(req.headers['user_uid'] !== req.innerBody['item']['video_user_uid'] && alertList['is_alert_comment'] == 0){
                    let fcmComment = await fcmUtil.fcmVideoCommentSingle(req.innerBody['item'])
                    await queryInsertFCM(fcmComment['data'], db_connection)
                }

                deleteBody(req)
                sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
            }
            else if(req.paramBody['type']=== 2){
                req.innerBody['item'] = await queryPhotoReviewComment(req, db_connection)

                sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
            }
            else if(req.paramBody['type']=== 3){
                req.innerBody['item'] = await queryCommunityPostComment(req, db_connection)

                sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
            }
        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        } );

    }
    catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function checkParam(req) {
    paramUtil.checkParam_noReturn(req.paramBody, 'target_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'content');
    paramUtil.checkParam_noReturn(req.paramBody, 'type');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_comment'
        , [
            req.headers['user_uid'],
            req.paramBody['video_uid'],
            req.paramBody['content'],
        ]
    );
}

function queryPhotoReviewComment(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_comment_photo_review_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['target_uid'],
            req.paramBody['content'],
        ]
    );
}

function queryCommunityPostComment(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_comment_community_post_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['target_uid'],
            req.paramBody['content'],
        ]
    );
}

function queryInsertFCM(data, db_connection){

    return mysqlUtil.querySingle(db_connection
        ,'call proc_create_fcm_data'
        , [
            data['user_uid'],
            data['alarm_type'],
            data['title'],
            data['message'],
            data['video_uid'] == null? 0 : data['video_uid'],
            data['target_uid'] == null? 0 : data['target_uid'],
            data['icon_filename']
        ]
    );
}

function queryAlertComment(req, db_connection){

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_alert_list'
        , [
            req.innerBody['item']['video_user_uid']
        ]
    )
}