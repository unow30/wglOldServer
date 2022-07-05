/**
 *
 * @swagger
 * /api/private/groupbuying/room/user:
 *   post:
 *     summary: 공구 방 유저 참여
 *     tags: [GroupBuying]
 *     description: |
 *       path : /api/private/groupbuying/room/user
 *
 *       * 공구 방 유저 참여
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           공구 방 유저 참여
 *
 *         schema:
 *           type: object
 *
 *           required:
 *             - group_buying_room_uid
 *             - quantity
 *           properties:
 *             group_buying_room_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 공구상품의 방 uid
 *             quantity:
 *               type: number
 *               example: 10
 *               description: |
 *                 물건 구매 개수
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

let file_name = fileUtil.name(__filename);

module.exports = async function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);

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
        , 'call proc_create_groupbuyingroomuser'
        , [ req.headers['user_uid'],
            req.paramBody['group_buying_room_uid'],
            req.paramBody['quantity'],
        ]
    );
}