/**
 * Created by hyunhunhwang on 2021. 02. 15.
 *
 * @swaggeraaa
 * /api/private/addressbook/detail:
 *   get:
 *     summary: 배송지 상세(단일)
 *     tags: [AddressBook]
 *     description: |
 *       path : /api/private/addressbook/detail
 *
 *       * 배송지 상세(단일)
 *
 *     parameters:
 *       - in: query
 *         name: addressbook_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: 배송지 uid
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/AddressBook'
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

            req.innerBody['item'] = await querySelect(req, db_connection);

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
    paramUtil.checkParam_noReturn(req.paramBody, 'addressbook_uid');
    // paramUtil.checkParam_noReturn(req.paramBody, 'product_uid');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_addressbook_detail'
        , [
            req.headers['user_uid'],
            req.paramBody['addressbook_uid'],
        ]
    );
}


