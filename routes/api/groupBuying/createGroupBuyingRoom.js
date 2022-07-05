/**
 *
 * @swagger
 * /api/private/groupbuying/room:
 *   post:
 *     summary: 공구 방 생성
 *     tags: [GroupBuying]
 *     description: |
 *       path : /api/private/groupbuying/room
 *
 *       * 공구 방 생성
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           공구 방 생성
 *
 *         schema:
 *           type: object
 *
 *           required:
 *             - group_buying_uid
 *             - recruitment
 *             - quantity
 *           properties:
 *             group_buying_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 공구상품 uid
 *             recruitment:
 *               type: number
 *               example: 2
 *               description: |
 *                 방 최대 정원 (모집인원) (group_buying의 room_type에 있는 조건 예)2,5,10 으로만 보내게 해야함)
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
        , 'call proc_create_groupbuyingroom'
        , [ req.headers['user_uid'],
            req.paramBody['group_buying_uid'],
            req.paramBody['recruitment'],
            req.paramBody['quantity'],
        ]
    );
}