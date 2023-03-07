/**
 * Created by yunho kim
 *
 * @swagger
 * /api/private/v2/weggler/follow/recommend/list:
 *   get:
 *     summary: 팔로우 추천 위글러 불러오기
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/follow/recommend/list:
 *
 *       * ## 팔로우 추천 위글러 불러오기
 *       * ## limit 20으로 20개만 불러온다.
 *       * ## 위글러 => 피드화면에 10개, 검색화면에 10개씩 표시한다.
 *       * ## 추천위글러 전체보기 누르면 20개 전체 보여주기
 *
 *     parameters:
 *       - in: query
 *         name: random_seed
 *         required: true
 *         schema:
 *           type: string
 *           example: 133q1234
 *         description: |
 *           검색할 때 필요한 랜덤 시드입니다.
 *
 *     responses:
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
const dateUtil = require('../../../../../common/utils/dateUtil')


let file_name = fileUtil.name(__filename);
module.exports = function (req, res) {
    const _funcName = arguments.callee.name;
    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};
            // req.paramBody['followList'] = await queryFollowList(req, db_connection); //로그인 한 유저의 팔로우 리스트
            // req.paramBody['followList'] = req.paramBody['followList'].map(el=> el.user_uid)
            // req.paramBody['followList'].push(req.headers['user_uid'])
            //
            // req.innerBody['item'] = await queryFollowFeedList(req, db_connection);

            req.innerBody['item'] = await queryFollowRecommendList(req, db_connection)


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

function deleteBody(req) {
}

async function queryFollowRecommendList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
    , 'call proc_select_recommend_user_follow_list_v2'
    ,   [
            req.headers['user_uid'],
            req.paramBody['random_seed'],
        ]
    )
}