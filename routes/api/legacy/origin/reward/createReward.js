/**
 * Created by hyunhunhwang on 2021. 02. 17.
 *
 * @swagger
 * /api/private/reward:
 *   post:
 *     summary: 리워드 환급 요청
 *     tags: [Reward]
 *     description: |
 *       path : /api/private/reward
 *
 *       * 리워드 환급 요청
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           리워드 환불 요청
 *         schema:
 *           type: object
 *           required:
 *             - amount
 *             - account_book_uid
 *           properties:
 *             amount:
 *               type: number
 *               example: 30000
 *               description: |
 *                 환급 요청 금액
 *             account_book_uid:
 *               type: number
 *               example: 1
 *               description: 계좌 uid
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/RewardApi'
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const paramUtil = require('../../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../../common/utils/legacy/origin/logUtil');
const jwtUtil = require('../../../../../common/utils/legacy/origin/jwtUtil');

const errCode = require('../../../../../common/define/errCode');

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

            req.innerBody['item'] = await query(req, db_connection);

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
    paramUtil.checkParam_noReturn(req.paramBody, 'amount');
    paramUtil.checkParam_noReturn(req.paramBody, 'account_book_uid');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_reward_refund_request'
        , [
            req.headers['user_uid'],
            req.paramBody['amount'],
            req.paramBody['account_book_uid'],
        ]
    );
}

