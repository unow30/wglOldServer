/**
 * Created by yunhokim on 2022. 12. 19.
 *
 * @swagger
 * /api/private/v2/event/filename:
 *   get:
 *     summary: 이벤트 페이지 이미지 불러오기
 *     tags: [Event]
 *     description: |
 *       path : /api/private/v2/event/filename
 *
 *       * ## 이벤트 페이지 이미지 불러오기
 *       * ### /v2/searchview/list/all에서 ad_list안의 uid가 ad_uid이다.
 *       * ### 클릭한 배너의 url이 eventActivity라면 해당 api를 실행해서 이미지를 가져온다.
 *       * ### 해당 배너와 연계된 ad 테이블의 uid와 일치하는 이미지 파일(type 107)을 가져온다.
 *       * ### 로그인 한 유저만 들어갈 수 있다.
 *
 *     parameters:
 *       - in: query
 *         name: ad_uid
 *         required: true
 *         schema:
 *           type: number
 *           example:
 *         description: 광고 uid
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
const errCode = require('../../../common/define/errCode');

const dateUtil = require('../../../common/utils/dateUtil')

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

            let event_data = await queryEventImage(req, db_connection);

            req.innerBody['item'] = event_data

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

}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function queryEventImage(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_event_image_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['ad_uid'],
        ]
    );
}



