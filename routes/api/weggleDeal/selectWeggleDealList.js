/**
 * Created by hyunhunhwang on 2021. 01. 19.
 *
 * @swagger
 * /api/private/weggledeal/list:
 *   get:
 *     summary: 위글딜 목록
 *     tags: [WeggleDeal]
 *     description: |
 *       path : /api/private/weggledeal/list
 *
 *       * 위글딜 목록
 *       * 위글딜 목록은 랜덤으로 주기 때문에 page 개념이 없습니다.
 *     parameters:
 *       - in: query
 *         name: video_uid
 *         default: 0
 *         required: false
 *         schema:
 *           type: number
 *           example: 0
 *         description: weggledeal 우선순위 video_uid
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/Feed'
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


            req.innerBody['type'] = 0;
            if(req.paramBody['video_uid'] > 0) {
                req.innerBody['item'] = await querySelect(req, db_connection);
                req.paramBody['video_uid'] = 0;
                req.innerBody['type'] = 1;
            }
            req.innerBody['item'] += await querySelect(req, db_connection);


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
    // paramUtil.checkParam_noReturn(req.paramBody, 'latitude');
    // paramUtil.checkParam_noReturn(req.paramBody, 'longitude');
}

function deleteBody(req) {
    for( let idx in req.innerBody['item'] ){
        // delete req.innerBody['item'][idx]['filename']
    }
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_weggledeal_list'
        , [
            req.headers['user_uid'],
            req.paramBody['video_uid'],
            req.innerBody['type'],
        ]
    );
}

