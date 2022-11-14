/**
 * Created by jongho
 *
 * 
 * @swagger
 * /api/private/v2/user/reward/info:
 *   get:
 *     summary: 리워드 환급 정보 불러오는 api
 *     tags: [User]
 *     description: |
 *       path : /api/private/v2/user/reward/info
 *
 *       * 유저 총 판매액, 환급가능 리워드, 유저프로필, 닉네임 가져오는 api
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

            req.innerBody['item'] = await querySelect(req, db_connection);
            if(req.innerBody.item.bank_info){
                req.innerBody.item.bank_info = JSON.parse(req.innerBody.item.bank_info)

                const payload = jwtUtil.getPayload(req.innerBody.item.bank_info.bank_account)
                req.innerBody.item.bank_info.bank_account = payload.account ?? null
            }
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

}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_user_reward_info_v2'
        , [
            req.headers['user_uid'],
        ]
    );
}