/**
 * Created by yunhokim on 2022. 03. 02.
 *
 * @swagger
 * /api/private/searchview/weggledeal/video/list:
 *   get:
 *     summary: 검색 화면 - weggledeal 비디오 목록(배너이미지 관련영상 우선 표시)
 *     tags: [SearchView]
 *     description: |
 *       path : /api/private/searchview/weggledeal/video/list
 *
 *       * 검색 화면 - weggledeal 비디오 목록(배너이미지 관련영상 우선 표시)
 *
 *     parameters:
 *       - in: query
 *         name: seller_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 4
 *         description: |
 *           판매자uid(위글딜 리스트에 우선 나타난다)
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
 *           페이지 시작 값을 넣어주시면 됩니다. Limit 30
 *           offset 0: 0~30
 *           offset 30: 30~60
 *           offset 60: 60~90
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const paramUtil = require('../../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../../common/utils/legacy/origin/logUtil');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        // checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await querySeller(req, db_connection);

            // deleteBody(req)
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

function querySeller(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_weggledeal_video_list'
        , [
            req.headers['user_uid']
            ,req.paramBody['seller_uid']
            ,req.paramBody['random_seed']
            ,req.paramBody['offset']
        ]
    );
}

