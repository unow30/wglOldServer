/**
 *
 * @swagger
 * /api/private/v2/reward:
 *   post:
 *     summary: 리워드 환급 요청
 *     tags: [Reward]
 *     description: |
 *       path : /api/private/v2/reward
 *
 *       * 리워드 환급 요청
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           리워드 환급 요청
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
 *             bank_user_name:
 *               type: string
 *               example: 한가인
 *               description: 예금주명
 *             bank_account:
 *               type: string
 *               example: 123-12-12345
 *               description: 계좌번호
 *             bank_code:
 *               type: string
 *               example: 004
 *               description: 은행코드
 *             bank_book_filename:
 *               type: string
 *               example: abcd.jpg
 *               description: 통장사본 이미지
 *             id_card_filename:
 *               type: string
 *               example: abcd.jpg
 *               description: 신분증
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

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};
            req.paramBody['bank_account'] = jwtUtil.createBankAccount(req.paramBody['bank_account'])
            req.innerBody['item'] = await query(req, db_connection);
            
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
    paramUtil.checkParam_noReturn(req.paramBody, 'bank_user_name');
    paramUtil.checkParam_noReturn(req.paramBody, 'bank_account');
    paramUtil.checkParam_noReturn(req.paramBody, 'bank_code');
    paramUtil.checkParam_noReturn(req.paramBody, 'bank_book_filename');
    paramUtil.checkParam_noReturn(req.paramBody, 'id_card_filename');

}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_reward_refund_request_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['amount'],
            req.paramBody['bank_user_name'],
            req.paramBody['bank_account'],
            req.paramBody['bank_code'],
            req.paramBody['bank_book_filename'],
            req.paramBody['id_card_filename']
        ]
    );
}