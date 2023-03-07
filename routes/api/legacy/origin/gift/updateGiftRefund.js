/**
 * Created by gunucklee on 2021. 11. 29.
 *
 * @swagger
 * /api/private/gift/refund:
 *   put:
 *     summary: 선물 환불
 *     tags: [Gift]
 *     description: |
 *       path : /api/private/gift/refund
 *
 *       * 선물 거절
 *       status 는 order_product status 입니다.
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           선물 거절하기
 *         schema:
 *           type: object
 *           required:
 *             - order_uid
 *             - order_product_uid
 *             - gift_uid
 *             - status
 *           properties:
 *             order_uid:
 *               type: number
 *               example: 297
 *               description: |
 *                 주문 uid
 *             order_product_uid:
 *               type: number
 *               example: 530
 *               description: |
 *                 상세 주문 uid
 *             gift_uid:
 *               type: string
 *               example: 22
 *               description: |
 *                 선물 uid
 *             status:
 *               type: number
 *               example: 0
 *               description: |
 *                 선물 상태
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/GiftRefundApi'
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

    try{
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await query(req, db_connection);


            if( req.innerBody['item'] && req.innerBody['item']['refund_reward'] > 0) {
                await queryRollbackReward(req, db_connection)
            }

            deleteBody(req)
            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

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
}

function deleteBody(req) {
}

function query(req, db_connection){
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_gift_reg_refund'
        , [
            req.headers['user_uid']? req.headers['user_uid'] : req.paramBody['user_uid'],
            req.paramBody['order_uid'],
            req.paramBody['gift_uid'],
        ]

    );
}

function queryRollbackReward(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call w_seller_update_rollback_reward'
        , [
            req.innerBody['item']['user_uid'],
            req.innerBody['item']['seller_uid'],
            req.innerBody['item']['order_uid'],
            req.innerBody['item']['order_no'],
            13,
            req.innerBody['item']['refund_reward'],
            '환불로 인한 사용 리워드 롤백',
        ]

    );
}
