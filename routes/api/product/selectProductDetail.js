/**
 * Created by hyunhunhwang on 2021. 01. 12.
 *
 * @swagger
 * /api/private/product/detail:
 *   get:
 *     summary: 상품 상세
 *     tags: [Product]
 *     description: |
 *       path : /api/private/product/detail
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
 *       - in: query
 *         name: latitude
 *         default: 37.536977
 *         required: true
 *         schema:
 *           type: number
 *           example: 37.536977
 *         description: 위도 ( ex - 37.500167 )
 *       - in: query
 *         name: longitude
 *         default: 126.955242
 *         required: true
 *         schema:
 *           type: number
 *           example: 126.955242
 *         description: 경도 ( ex - 126.955242 )
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/ProductDetail'
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

const errCode = require('../../../common/define/errCode');

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

            req.innerBody['item'] = await queryDetail(req, db_connection);
            if (!req.innerBody['item']) {
                errUtil.createCall(errCode.empty, `상품이 존재하지 않습니다.`)
                return
            }
            req.innerBody['image_list'] = await queryImageList(req, db_connection);
            req.innerBody['video_list'] = await queryReviewList(req, db_connection);
            req.innerBody['faq_list'] = await queryFaqList(req, db_connection);
            req.innerBody['qna_list'] = await queryQnAList(req, db_connection);

            deleteBody(req)
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
    paramUtil.checkParam_noReturn(req.paramBody, 'latitude');
    paramUtil.checkParam_noReturn(req.paramBody, 'longitude');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function queryDetail(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_product_detail'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
            req.paramBody['latitude'],
            req.paramBody['longitude'],
        ]
    );
}

function queryImageList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_image_list'
        , [
            req.paramBody['product_uid'],
            2,
        ]
    );
}

function queryReviewList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_review_list'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
            0,
            4,
        ]
    );
}

function queryFaqList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_faq_list'
        , [
            req.paramBody['product_uid'],
        ]
    );
}

function queryQnAList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_qna_list'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
            0,
            3
        ]
    );
}


