/**
 * Created by yunhokim on 2022. 09. 27.
 *
 * @swagger
 * /api/private/addressbook/island:
 *   get:
 *     summary: 배송지 도서산간지 체크
 *     tags: [AddressBook]
 *     description: |
 *       path : /api/private/addressbook/island
 *
 *       * 배송지 도서산간지 체크(이 시점에 주소저장은 안됨. 상세주소 미등록이라)
 *       * 배송지 정보 -> 우편번호 찾기 -> 주소 선택완료 후 실행
 *
 *     parameters:
 *       - in: query
 *         name: zipcode
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 22386
 *         description: |
 *           우편번호
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

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            let result = await querySelect(req, db_connection);
            req.innerBody['type'] = result['type']

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
    // paramUtil.checkParam_noReturn(req.paramBody, 'user_uid');
    // paramUtil.checkParam_noReturn(req.paramBody, 'last_uid');
}

function deleteBody(req) {
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_addressbook_island_check'
        , [
            req.paramBody['zipcode'],
        ]
    );
}