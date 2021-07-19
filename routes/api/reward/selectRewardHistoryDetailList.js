/**
 * Created by gunucklee on 2021. 06. 16.
 *
 * @swagger
 * /api/private/reward/history/detail/list:
 *   get:
 *     summary: 리워드 히스토리 디테일 목록
 *     tags: [Reward]
 *     description: |
 *       path : /api/private/reward/history/detail/list
 *
 *       * 리워드 히스토리 디테일 목록
 *         * state: {1: 리워드 리뷰 적립}
 *
 *     parameters:
 *       - in: query
 *         name: video_uid
 *         default: 1
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: 리워드 히스토리 디테일 목록을 볼 video uid 입력
 *       - in: query
 *         name: last_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: date 목록 마지막 uid (처음일 경우 0)
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/QnA'
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

            let count_data = await querySelectTotalCount(req, db_connection);
            req.innerBody['item'] = await querySelect(req, db_connection);
            req.innerBody['item'] = createJSONArray(req.innerBody['item'])
            req.innerBody['total_count'] = count_data['total_count'];

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
    paramUtil.checkParam_noReturn(req.paramBody, 'last_uid');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}
function createJSONArray(item){
    if( item ){
        for( let idx in item ){
            item[idx]['reward_history_list'] = JSON.parse(item[idx]['reward_history_list'])
        }
    }
    return item;
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_reward_history_detail_list'
        , [
            req.headers['user_uid'],
            req.paramBody['video_uid'],
            req.paramBody['last_uid'],
        ]
    );
}

function querySelectTotalCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_reward_history_detail_list_count'
        , [
            req.headers['user_uid'],
            req.paramBody['video_uid'],
        ]
    );
}


