/**
 * Created by yunhokim on 2022. 02. 08.
 *
 * @swagger
 * /api/private/block/user :
 *   put:
 *     summary: 유저 차단 해제
 *     tags: [Block]
 *     description: |
 *       path : /api/private/block/user
 *
 *       * 유저 차단 해제
 *       * 엑세스토큰의 user_uid 사용
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           유저 차단 해제
 *         schema:
 *           type: object
 *           required:
 *             - user_uid
 *             - block_uid
 *           properties:
 *             block_uid:
 *               type: integer
 *               example: 1
 *               description: 차단 uid(유저 차단 type = 1)
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/BlockUpdateUserApi'
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
const jwtUtil = require('../../../../../common/utils/legacy/origin/jwtUtil');

const errCode = require('../../../../../common/define/errCode');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        // checkParam(req);
        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await query(req, db_connection);

            if( !req.innerBody['item'] ){
                errUtil.createCall(errCode.err, `존재하지 않는 차단 uid입니다.`)
                return
            }

            // deleteBody(req)
            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        } );

    }
    catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function checkParam(req) {

}

function deleteBody(req) {

}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_block_user_list'
        , [
            req.headers['user_uid'],
            req.paramBody['block_uid'],

        ]
    );
}


