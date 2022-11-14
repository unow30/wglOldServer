/**
 *
 * @swagger
 * /api/public/v1/groupbuying/detail/room/list:
 *   get:
 *     summary: 공동구매에 참여한 방,유저 전체 불러오기
 *     tags: [GroupBuying]
 *     description: |
 *       path : /api/public/v1/groupbuying/detail/room/list
 *
 *       * 공동구매에 참여한 방,유저 전체 불러오기
 *
 *     parameters:
 *       - in: query
 *         name: groupbuying_uid
 *         default: 15
 *         required: true
 *         schema:
 *           type: number
 *           example: 15
 *         description: |
 *           해당 공동구매 uid
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

            const matchRoom = queryMatchRoom(req, db_connection);
            const notMatchRoom = queryNotMatchRoom(req, db_connection);

            const [matchRoomData, notMatchRoomData] = await Promise.all([matchRoom, notMatchRoom]);

            req.innerBody['item'] = [...matchRoomData, ...notMatchRoomData];
            console.log('======================================>>>>>>>>>>>>>>>>>')
            console.log(req.innerBody['item'])

            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });

    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function queryMatchRoom(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_gongu_detail_room_user_match_v1'
        ,[ req.paramBody['groupbuying_uid']]
    );
}

function queryNotMatchRoom(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_gongu_detail_room_user_not_match_v1'
        ,[ req.paramBody['groupbuying_uid']]
    );
}