/**
 * Created by hyunhunhwang on 2021. 03. 13.
 *
 * @swagger
 * /api/private/order/status:
 *   put:
 *     summary: 상품 구매 상태 수정
 *     tags: [Order]
 *     description: |
 *       path : /api/private/order/status
 *
 *       * 상품 구매 상태 수정
 *         * 구매 상태 값 {5: 구매 확정, 6: 구매 취소}
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           상품 구매 상태 수정
 *         schema:
 *           type: object
 *           required:
 *             - order_uid
 *             - status
 *           properties:
 *             order_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 구매확정할 구매 uid
 *             status:
 *               type: number
 *               example: 5
 *               description: |
 *                 구매 상태 값
 *                 * 5: 구매 확정
 *                 * 6: 구매 취소
 *               enum: [5,6]
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/Order'
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

            req.innerBody['item'] = await query(req, db_connection);

            console.log(req.innerBody['item'])

            if( req.paramBody['status'] === 5 && req.innerBody['item'] ){
                req.innerBody['item'].map(async (item, idx) => {
                    let reward = await queryUpdate(req, db_connection, item);
                })
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
    paramUtil.checkParam_noReturn(req.paramBody, 'order_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'status');

    if( !(req.paramBody['status'] === 5 || req.paramBody['status'] === 6) ){
        errUtil.createCall(errCode.param, `파라미터 오류 발생. 파라미터를 확인해 주세요.\n확인 파마리터 : status 취소/확정 만 가능`);
    }
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['product']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_order_status'
        , [
            req.headers['user_uid'],
            req.paramBody['order_uid'],
            req.paramBody['status'],
        ]
    );
}

function queryUpdate(req, db_connection, item) {
    const _funcName = arguments.callee.name;

    let reward_value = 0;  // 결제 금액의 5% 지급
    if( !isNaN(item['payment']) && item['payment'] > 0 ){
        reward_value = item['payment'] / 100 * 5;  // 결제 금액의 5% 지급
    }

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_reward'
        , [
            req.headers['user_uid'],
            item['product_uid'],
            item['seller_uid'],
            item['video_uid'],

            item['order_uid'],
            reward_value,  // 결제 금액의 5% 지급
            `[${req.innerBody['name']}] 리워드 적립`,
            // req.paramBody['status'],
        ]
    );
}

