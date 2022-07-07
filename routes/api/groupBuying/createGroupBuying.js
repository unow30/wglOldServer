/**
 *
 * @swagger
 * /api/private/groupbuying:
 *   post:
 *     summary: 공구 생성
 *     tags: [GroupBuying]
 *     description: |
 *       path : /api/private/groupbuying
 *
 *       * 공구 생성
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           공구 생성
 *
 *         schema:
 *           type: object
 *           required:
 *             - product_uid
 *             - product_name
 *             - gongu_price
 *             - gongu_rate
 *             - end_time
 *             - start_time
 *             - options
 *             - room_type
 *           properties:
 *             product_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 상품 uid
 *           product_name:
 *               type: string
 *               example: 맥북
 *               description: |
 *                 상품 이름
 *             gongu_price:
 *               type: number
 *               example: 15000 (공구 썸네일에 표시될 최저가)
 *               description: |
 *                 공구 썸네일에 표시될 최저가
 *             gongu_rate:
 *               type: number
 *               example: 30
 *               description: |
 *                 기존 상품가의 할인율
 *             end_time:
 *               type: string
 *               example: 7
 *               description: |
 *                 공동구매 몇일간 진행할지에 대한 일수 예) 7일간 진행시 숫자 7
 *             start_time:
 *               type: string
 *               example: 2022-07-01 15:18:51
 *               description: |
 *                 공동구매 시작 날짜
 *             options:
 *               type: array
 *               description: 상품에 대한 옵션 (상품옵션, 가격, 재고 등)
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: 빨간색 라운드 티 M 
 *                     description: 상품 옵션
 *                   stock:
 *                     type: number
 *                     example: 100
 *                     description: |
 *                       상품 재고 수
 *                   sales_quantity:
 *                     type: number
 *                     example: 0
 *                     description: |
 *                       판매량 (처음 등록시 무조건 0 이여야 함)
 *             room_type:
 *               type: array
 *               description: 공구 방생성
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: number
 *                     example: 2 
 *                     description: 공동구매에서 방 생성시 생성할수 있는 인원수 (2, 5, 10)만 가능
 *                   price:
 *                     type: number
 *                     example: 15000
 *                     description: |
 *                       방 생성 인원에 따른 할인가
 *
 *     responses:
 *       200:
 *         description: 성공 코드 200
 *       400:
 *         description: 에러 코드 400
 */

const paramUtil = require('../../../common/utils/paramUtil');
const fileUtil = require('../../../common/utils/fileUtil');
const mysqlUtil = require('../../../common/utils/mysqlUtil');
const sendUtil = require('../../../common/utils/sendUtil');
const errUtil = require('../../../common/utils/errUtil');
const logUtil = require('../../../common/utils/logUtil');
const naverUtil = require('../../../common/utils/naverUtil');

let file_name = fileUtil.name(__filename);

module.exports = async function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);

        const naverAPI = new naverUtil(req.paramBody.product_name);
        const naverProduct = await naverAPI.result();
        req.paramBody['naver_product'] = naverProduct.items[0];
        req.paramBody['options'] = optionJson(req);
        req.paramBody['room_type'] = typeJson(req);

        console.log(req.paramBody)
        console.log('==========================================')

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await queryCreate(req, db_connection);

            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });

    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function queryCreate(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_groupbuying'
        , [
            req.paramBody['product_uid'],
            req.paramBody['gongu_price'],
            req.paramBody['gongu_rate'],
            req.paramBody.naver_product['link'],
            req.paramBody.naver_product['lprice'],
            req.paramBody['end_time'],
            req.paramBody['start_time'],
            req.paramBody['options'],
            req.paramBody['room_type']
        ]
    );
}

function optionJson (req) {
    return  JSON.stringify( req.paramBody['options'] );

}

function typeJson(req) {
    return  JSON.stringify( req.paramBody['room_type'] )
}