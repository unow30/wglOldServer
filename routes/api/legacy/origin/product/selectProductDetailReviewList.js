/**
 * Created by hyunhunhwang on 2021. 01. 12.
 *
 * @swagger
 * /api/public/product/detail/review/list:
 *   get:
 *     summary: 상품 상세 영상, 사진리뷰 및 카운트
 *     tags: [Product]
 *     description: |
 *       path : /api/public/product/detail/review/list
 *
 *       * 상품 상세
 *
 *     parameters:
 *       - in: query
 *         name: product_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: 상품 uid
 *
 *     responses:
 *       200:
 *         description: 성공 코드 200
 *       400:
 *         description: 에러 코드 400

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

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};


            const videoCount = videoListCount(req, db_connection);
            const photoCount = photoListCount(req, db_connection);
            const video = videoList(req, db_connection);
            const photo = photoList(req, db_connection);

            const [videoCountData, photoCountData, videoData, photoData] = await Promise.all([videoCount, photoCount, video, photo]);

            req.innerBody['video'] = videoData;
            req.innerBody['photo'] = photoData;
            req.innerBody['video_count'] = videoCountData.video_count;
            req.innerBody['photo_count'] = photoCountData.photo_count;
            req.innerBody['total_count'] = videoCountData.video_count + photoCountData.photo_count;

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
    paramUtil.checkParam_noReturn(req.paramBody, 'product_uid');
}

function videoList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_product_detail_video_review_list_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
        ]
    );
}

function photoList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_product_detail_photo_review_list_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
        ]
    );
}

function videoListCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_product_detail_video_review_list_count_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
        ]
    );
}

function photoListCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_product_detail_photo_review_list_count_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
        ]
    );
}