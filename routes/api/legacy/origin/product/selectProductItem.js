/**
 * Created by yunhokim on 2022. 07. 19.
 *
 * @swagger
 * /api/private/product:
 *   get:
 *     summary: 상품 아이템 전달
 *     tags: [Product]
 *     description: |
 *       path : /api/private/product
 *
 *       * 상품 상세
 *       * 리뷰작성(영상,사진)시 주문내역에 대한 리뷰작성, 상품에 대한 리뷰 작성 화면에 주문정보 또는 상품정보 전달
 *       * 상품이 없을경우 리뷰작성 불가
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
 *         name: order_product_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: 주문상품 uid
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *       400:
 *         description: 에러 코드 400
 */

const paramUtil = require('../../../../../common/utils/paramUtil');
const fileUtil = require('../../../../../common/utils/fileUtil');
const mysqlUtil = require('../../../../../common/utils/mysqlUtil');
const sendUtil = require('../../../../../common/utils/sendUtil');
const errUtil = require('../../../../../common/utils/errUtil');
const logUtil = require('../../../../../common/utils/logUtil');

const errCode = require('../../../../../common/define/errCode');

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
    paramUtil.checkParam_noReturn(req.paramBody, 'order_product_uid');
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
        , 'call proc_select_product_item'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
            req.paramBody['order_product_uid'],
        ]
    );
}

/*
* 상품 아이템을 보여주는 경우는 order_product의 상품정보 - 내가 구매한 상품, 옵션, 가격, 확정일 이거나
* 그냥 상품 아이템 - product.uid로 접근해서 현재 판매중인 상품정보
* */