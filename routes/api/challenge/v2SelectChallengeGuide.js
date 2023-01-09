/**
 * Created by jongho
 *
 * 
 * @swagger
 * /api/private/v2/challenge/guide:
 *   get:
 *     summary: 챌린지 가이드
 *     tags: [Challenge]
 *     description: |
 *       path : /api/private/v2/challenge/guide
 *
 *       * 챌린지 가이드
 *
 *     parameters:
 *       - in: query
 *         name: challenge_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           챌린지 uid
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

            const challengeGuide = await querySelect(req, db_connection);
            if(challengeGuide){
                req.innerBody['item'] = challengeGuide
            }
            else{
                req.innerBody['item'] = {}
            }

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
    paramUtil.checkParam_noReturn(req.paramBody, 'challenge_uid');
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_challenge_guide_v2'
        , [
            req.paramBody['challenge_uid'],
        ]
    );
}