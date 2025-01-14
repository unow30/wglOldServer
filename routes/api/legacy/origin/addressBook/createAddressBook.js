/**
 * Created by hyunhunhwang on 2021. 01. 16.
 *
 * @swagger
 * /api/private/addressbook:
 *   post:
 *     summary: 배송지 추가
 *     tags: [AddressBook]
 *     description: |
 *       path : /api/private/addressbook
 *
 *       * 배송지 추가
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           배송지 추가
 *         schema:
 *           type: object
 *           required:
 *             - receive_name
 *             - phone
 *             - address
 *             - address_detail
 *             - is_default
 *           properties:
 *             receive_name:
 *               type: string
 *               example: 홍길동
 *               description: |
 *                 받는사람명
 *             phone:
 *               type: string
 *               example: 000-0000-0000
 *               description: |
 *                 연락처
 *             zipcode:
 *               type: string
 *               example: "00000"
 *               description: |
 *                 우편번호
 *             address:
 *               type: string
 *               example: 서울 강남구 어디어디
 *               description: |
 *                 기본 주소
 *             address_detail:
 *               type: string
 *               example: A아파트 00동 00호
 *               description: |
 *                 상세 주소
 *             is_default:
 *               type: number
 *               example: 0
 *               description: |
 *                 기본 주소 여부
 *                 * 0: false
 *                 * 1: true (기본주소)
 *               enum: [0,1]
 *
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/AddressBookApi'
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
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await query(req, db_connection);

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
    paramUtil.checkParam_noReturn(req.paramBody, 'receive_name');
    paramUtil.checkParam_noReturn(req.paramBody, 'phone');
    paramUtil.checkParam_noReturn(req.paramBody, 'address');
    paramUtil.checkParam_noReturn(req.paramBody, 'address_detail');
    paramUtil.checkParam_noReturn(req.paramBody, 'is_default');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_addressbook'
        , [
            req.headers['user_uid'],
            req.paramBody['receive_name'],
            req.paramBody['phone'],
            req.paramBody['zipcode'],
            req.paramBody['address'],
            req.paramBody['address_detail'],
            req.paramBody['is_default'],
        ]
    );

}

