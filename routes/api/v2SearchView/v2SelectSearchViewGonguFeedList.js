/**
 * Created by yunhokim on 2022. 12. 07.
 *
 * @swagger
 * /api/public/v2/searchview/gongu/feed/list:
 *   get:
 *     summary: 영상으로 만나는 공동구매 더보기
 *     tags: [v2SearchView]
 *     description: |
 *       path : /api/public/v2/searchview/gongu/feed/list
 *
 *       * ## 영상으로 만나는 공동구매 더보기
 *       * ### category: 전체표시, filter: 랜덤정렬 고정됨
 *       * 피드 목록(전체), 브랜드관, 공동구매, 마이굿즈가 있습니다.
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
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           페이지 시작 값을 넣어주시면 됩니다. 호출당 Limit 12
 *           offset 0: 0~11
 *           offset 12: 12~23
 *           offset 24: 24~35
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/FeedListApi'
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
        logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await queryGonguFeedList(req, db_connection);

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
    // paramUtil.checkParam_noReturn(req.paramBody, 'ad_product_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'random_seed');
    paramUtil.checkParam_noReturn(req.paramBody, 'offset');

}

function deleteBody(req) {
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function queryGonguFeedList(req, db_connection) {
    const _funcName = arguments.callee.name;
        return mysqlUtil.queryArray(db_connection
            , 'call proc_select_gongu_feed_list_v1'
            , [
                req.headers['user_uid'],
                req.paramBody['random_seed'],
                req.paramBody['offset'],
                0,//req.paramBody['filter'],
                65535,//req.paramBody['category'],
            ]
        );
}
