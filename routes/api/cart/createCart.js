/**
 * Created by hyunhunhwang on 2021. 01. 25.
 *
 * @swagger
 * /api/private/cart:
 *   post:
 *     summary: 장바구니 담기
 *     tags: [Cart]
 *     description: |
 *       path : /api/private/cart
 *
 *       * 장바구니 담기
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           장바구니 담기
 *         schema:
 *           type: object
 *           required:
 *             - product_uid
 *             - video_uid
 *             - option_ids
 *           properties:
 *             product_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 구매 상품 uid
 *             video_uid:
 *               type: number
 *               example: 0
 *               description: |
 *                 리뷰어 영상 uid
 *                 * 리뷰어가 없을 경우 0으로 보내면 됩니다.
 *             option_ids:
 *               type: string
 *               example: '101,201,302'
 *               description: |
 *                 옵션 id 목록
 *                 * 상품 옵션 테이블의 option_id 값을 ','로 구분하여 처리
 *                 * option_id 는 option_uid와 다릅니다.
 *                 * ex - '101,201,304'
 *             count:
 *               type: number
 *               example: 1
 *               description: |
 *                 구매 갯수
 *                 * 최소 1개 이상
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

const errCode = require('../../../common/define/errCode');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        // logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            // let check = await queryCheck(req, db_connection);
            // if( check ){
            //     errUtil.createCall(errCode.already, `이미 장바구니에 담겨 있습니다.`)
            //     return
            // }
            req.innerBody['item'] = await query(req, db_connection);

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
    paramUtil.checkParam_noReturn(req.paramBody, 'video_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'option_ids');
    paramUtil.checkParam_noReturn(req.paramBody, 'count');
    // paramUtil.checkParam_noReturn(req.paramBody, 'option_list');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_cart'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
            req.paramBody['video_uid'],
            req.paramBody['option_ids'],
            req.paramBody['count'],
        ]
    );
}

function queryCheck(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_cart_check'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
            req.paramBody['video_uid'],
            req.paramBody['option_ids'],
            req.paramBody['count'],
        ]
    );
}
