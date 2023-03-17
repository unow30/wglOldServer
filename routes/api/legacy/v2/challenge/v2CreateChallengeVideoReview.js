/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/challenge/video/review:
 *   post:
 *     summary: 챌린지 리뷰영상 작성
 *     tags: [Challenge]
 *     description: |
 *       path : /api/private/v2/challenge/video/review
 *
 *       * 챌린지 리뷰영상 작성
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           리뷰영상 작성
 *         schema:
 *           type: object
 *           required:
 *             - product_uid
 *             - content
 *             - filename
 *             - thumbnail
 *             - challenge_uid
 *           properties:
 *             product_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 상품 uid
 *             content:
 *               type: string
 *               example: 리뷰 내용입니다.
 *               description: 리뷰 내용
 *             filename:
 *               type: string
 *               example: 924fec841fcc7bec2f0f28cb72471f3dConvertSuccess.m3u8
 *               description: |
 *                 영상 파일명
 *             thumbnail:
 *               type: string
 *               example: 924fec841fcc7bec2f0f28cb72471f3dThumbnail.0000000.jpg
 *               description: |
 *                 썸네일 파일명
 *             challenge_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 챌린지 uid
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const path = require('path');
const paramUtil = require('../../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../../common/utils/legacy/origin/logUtil');
const fcmUtil = require('../../../../../common/utils/legacy/origin/fcmUtil');


let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            const videoInfo = await query(req, db_connection);
            if(videoInfo){
                req.paramBody['video_uid'] = videoInfo.uid

                const challengeVideoData = queryChallengeVideo(req, db_connection);
                const imageData = queryImage(req, db_connection);
                const videoProductData = queryVideoProduct(req, db_connection);

                await Promise.all([challengeVideoData, imageData, videoProductData])

                req.innerBody['success'] = 1

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
    paramUtil.checkParam_noReturn(req.paramBody, 'product_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'content');
    paramUtil.checkParam_noReturn(req.paramBody, 'filename');
    paramUtil.checkParam_noReturn(req.paramBody, 'thumbnail');
    paramUtil.checkParam_noReturn(req.paramBody, 'challenge_uid');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_challenge_video_review_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
            req.paramBody['content'],
            req.paramBody['filename'],
        ]
    );
}

function queryImage(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_challenge_video_review_image_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['thumbnail'],
            req.paramBody['video_uid'],
        ]
    );
}

function queryChallengeVideo(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_challenge_video_v2'
        , [
            req.paramBody['challenge_uid'],
            req.paramBody['video_uid'],
        ]
    );
}

function queryVideoProduct(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_challenge_video_product_v2'
        , [
            req.paramBody['product_uid'],
            req.paramBody['video_uid'],
        ]
    );
}