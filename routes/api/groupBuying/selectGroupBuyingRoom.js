/**
 *
 * @swagger
 * /api/private/groupbuying/room:
 *   get:
 *     summary: 공동구매에 참여한 방,유저 불러오기
 *     tags: [GroupBuying]
 *     description: |
 *       path : /api/private/groupbuying/room
 *
 *       * 공동구매에 참여한 방,유저 불러오기
 *
 *     parameters:
 *       - in: query
 *         name: groupbuying_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
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

            req.innerBody['item'] = await queryCreate(req, db_connection);
            console.log('======================================>>>>>>>>>>>>>>>>>')
            console.log(req.innerBody['item'])
            req.innerBody['item'] = mapfunc(req.innerBody['item']);

            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });

    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function mapfunc(item){
    return item.map(result =>{

        return {
            room_end_time: result.room_end_time,
            recruitment: result.recruitment,
            participants: result.participants,
            uid: result.uid,
            is_active: result.recruitment <= result.participants? 0:1,
            user: result.user.split('|').map(item=>{
                item = JSON.parse(item);

                return {
                    uid: item.uid,
                    is_head: item.is_head,
                    profile_image: item.profile_image,
                    user_uid: item.user_uid
                }
            })
        }
    })
}

function queryCreate(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_groupbuying_room_user'
        ,[ req.paramBody['groupbuying_uid']]
    );
}