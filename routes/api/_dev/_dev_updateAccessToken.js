/**
 * Created by yunhokim on 2022. 09. 13.
 *
 * @swagger
 * /api/public/dev/accesstoken:
 *   put:
 *     summary: 만료된 엑세스토큰 업데이트
 *     tags: [Dev]
 *     description: |
 *       path : /api/public/dev/accesstoken
 *
 *       * 만료된 엑세스토큰 업데이트
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           만료된 엑세스토큰 업데이트
 *         schema:
 *           type: object
 *           required:
 *             - uid
 *           properties:
 *             uid:
 *               type: number
 *               example: 0
 *               description: |
 *                 로그인할 유저 uid
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */
const paramUtil = require('../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../common/utils/legacy/origin/logUtil');
const jwtUtil = require('../../../common/utils/legacy/origin/jwtUtil');

const errCode = require('../../../common/define/errCode');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            //모든 유저의 access_token을 업데이트, jwt에서 대량으로 업데이트가 가능한가? => 그런 매소드 없다
            //변경할 유저의 uid를 입력해서 그 유저만 업데이트 해주자.
            // req.innerBody['item']['access_token'] = jwtUtil.createToken(req.innerBody['item'], '100d')
            req.innerBody['item'] = await query(req, db_connection);
            if(!req.innerBody['item']){
                errUtil.createCall(errCode.empty, '해당 유저정보가 없습니다.')
            }

            deleteBody(req)
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

function query(req, db_connection){
    const _funcName = arguments.callee.name;

    let accessToken = jwtUtil.createToken(req.paramBody, '100d')

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_access_token_for_dev'
        , [
            req.paramBody['uid'],
            accessToken
        ]

    );
}
