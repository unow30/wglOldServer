/**
 * Created by gunucklee on 2021. 06. 28.
 *
 * @swagger
 * /api/private/follow/find/list:
 *   get:
 *     summary: 팔로우/팔로잉 찾기 목록
 *     tags: [Follow]
 *     description: |
 *       path : /api/private/follow/find/list
 *
 *       * 팔로우/팔로잉 목록
 *
 *     parameters:
 *       - in: query
 *         name: search_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: integer
 *         description: 검색 uid
 *       - in: query
 *         name: find
 *         default: 도두녁
 *         required: true
 *         schema:
 *           type: string
 *           example: 도두녁
 *         description: 유저 이름
 *       - in: query
 *         name: type
 *         default: follower
 *         required: true
 *         schema:
 *           type: string
 *           example: follower
 *         description: |
 *           목록 타입
 *           * follower: 팔로워
 *           * following: 팔로잉
 *         enum: [follower, following]
 *       - in: query
 *         name: last_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: integer
 *           example: 0
 *         description: 목록 마지막 uid (처음일 경우 0)
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/FollowFindListApi'
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

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await querySelect(req, db_connection);

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
    // paramUtil.checkParam_noReturn(req.paramBody, 'signup_type');
    // paramUtil.checkParam_noReturn(req.paramBody, 'social_id');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_follow_find_list'
        , [
            req.paramBody['search_uid'],
            req.paramBody['find'],
            req.paramBody['type'],
            req.paramBody['last_uid'],
        ]
    );
}
