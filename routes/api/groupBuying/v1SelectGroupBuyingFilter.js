/**
 * Created by yunhokim on 2022. 07. 26.
 *
 * @swagger
 * /api/private/v1/groupbuying/filter:
 *   get:
 *     summary: 공동구매 상품 필터링
 *     tags: [GroupBuying]
 *     description: |
 *      ## path : /api/private/v1/groupbuying/filter:
 *
 *       * ## 공동구매 상품 필터링
 *       * ## 공동구매 구매여부 확인
 *       * ## 공동구매 방 참가여부 확인
 *       * ## 공동구매 옵션 구매수량 확인
 *       * ## 공동구매 타입 방 생성여부 확인
 *
 *     parameters:
 *       - in: query
 *         name: groupbuying_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: 공동구매 uid
 *       - in: query
 *         name: groupbuying_room_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: 공동구매 방 uid
 *       - in: query
 *         name: groupbuying_option_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: 공동구매 옵션 uid
 *
 *     responses:
 *       200:
 *         description: 성공 코드 200
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

const {log} = require("debug");

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        // logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        // checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            let groupbuying = await queryGroupBuying(req, db_connection);
            if (!groupbuying || groupbuying['is_authorized'] != 1) {
                errUtil.createCall(errCode.fail, `공동구매가 종료된 상품입니다.`)
                return
            }
            if (groupbuying['soldout'] == 1) {
                errUtil.createCall(errCode.fail, `공동구매 상품이 품절되었습니다.`)
                return
            }

            let groupbuyingRoom = await queryGroupBuyingRoom(req, db_connection);
            if (!groupbuyingRoom){
                errUtil.createCall(errCode.fail, `매칭이 해제된 방입니다. 다른 공동구매 방으로 입장하세요`)
                return
            }
            if (groupbuyingRoom['recruitment'] == groupbuyingRoom['participants'] || groupbuyingRoom['status'] == 1) {
                errUtil.createCall(errCode.fail, `매칭이 완료된 방입니다. 다른 공동구매 방으로 입장하세요`)
                return
            }

            let groupbuyingOption = await queryGroupBuyingOption(req, db_connection);
            if (groupbuyingOption['soldout'] == 1) {
                errUtil.createCall(errCode.fail, `옵션이 품절되었습니다.`)
                return
            }

            req.innerBody['item'] = 'ok'

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
    // paramUtil.checkParam_noReturn(req.paramBody, 'addressbook_uid');
    // paramUtil.checkParam_noReturn(req.paramBody, 'price_total');
    // paramUtil.checkParam_noReturn(req.paramBody, 'delivery_total');
    // paramUtil.checkParam_noReturn(req.paramBody, 'price_payment');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['product']
}

function queryGroupBuying(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_filter_groupbuying'
        , [
            req.headers['user_uid'],
            req.paramBody['groupbuying_uid'],
        ]
    );
}

function queryGroupBuyingRoom(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_filter_groupbuying_room'
        , [
            req.headers['user_uid'],
            req.paramBody['groupbuying_room_uid'],
        ]
    );
}

function queryGroupBuyingOption(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_filter_groupbuying_option'
        , [
            req.headers['user_uid'],
            req.paramBody['groupbuying_option_uid'],
        ]
    );
}