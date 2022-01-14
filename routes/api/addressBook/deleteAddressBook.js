/**
 * Created by hyunhunhwang on 2021. 01. 16.
 *
 * @swagger
 * /api/private/addressbook:
 *   delete:
 *     summary: 배송지 삭제
 *     tags: [AddressBook]
 *     description: |
 *       path : /api/private/addressbook
 *
 *       * 배송지 삭제
 *
 *     parameters:
 *       - in: query
 *         name: addressbook_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: 삭제할 배송지 uid
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/UserCheckApi'
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
const jwtUtil = require('../../../common/utils/jwtUtil');

const errCode = require('../../../common/define/errCode');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await query(req, db_connection);
            logUtil.printUrlLog(req, `req.innerBody: ${JSON.stringify(req.innerBody)}`);
            if (req.innerBody['item']) {
                errUtil.createCall(errCode.fail, `삭제에 실패하였습니다.`)
                return
            }

            req.innerBody['is_deleted'] = 1
            req.innerBody['success'] = '삭제가 완료되었습니다.'

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
    paramUtil.checkParam_noReturn(req.paramBody, 'addressbook_uid');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_delete_addressbook'
        , [
            req.headers['user_uid'],
            req.paramBody['addressbook_uid'],
        ]
    );
}
