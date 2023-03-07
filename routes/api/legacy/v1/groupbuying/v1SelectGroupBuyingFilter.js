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
 *       * ## 팀 참여하기 -> 상품옵션 선택 -> 구매하기 누를 때 필터링
 *       * ## 팀 생성하기 -> 공동구매 방 생성하기 -> 상품옵션 선택 -> 구매하기 누를 때 필터링
 *       * ## 결제정보 입력 -> 결제하기 누를 때 필터링
 *       * ## 공동구매 상품 필터링
 *       * ## 공동구매 구매여부 확인
 *       * ## 공동구매 방 참가여부 확인
 *       * ## 공동구매 옵션 품절여부 확인
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
 *           example: 0
 *         description: 공동구매 방 uid(없으면 0으로 전달)
 *       - in: query
 *         name: groupbuying_option_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: 공동구매 옵션 uid
 *       - in: query
 *         name: count
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         enum: [1,2,3,4,5,6,7,8,9,10]
 *         description: 공동구매 옵션 구매수량(최대 10개)
 *
 *     responses:
 *       200:
 *         description: 성공 코드 200
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const paramUtil = require('../../../../../common/utils/paramUtil');
const fileUtil = require('../../../../../common/utils/fileUtil');
const mysqlUtil = require('../../../../../common/utils/mysqlUtil');
const sendUtil = require('../../../../../common/utils/sendUtil');
const errUtil = require('../../../../../common/utils/errUtil');
const logUtil = require('../../../../../common/utils/logUtil');
const jwtUtil = require('../../../../../common/utils/jwtUtil');

const errCode = require('../../../../../common/define/errCode');

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

        // 공동구매 상품 필터링
        // 공동구매 구매여부 확인
        // 공동구매 방 참가여부 확인, 방이 없으면 필터링 다르게
        // 공동구매 옵션 품절여부 확인

        // 팀 참여하기 -> 상품옵션 선택 -> 구매하기 누를 때 필터링
        // 팀 생성하기 -> 공동구매 방 생성하기 -> 상품옵션 선택 -> 구매하기 누를 때 필터링 -> 공구하기 방이 있을 때, 없을 때 필터

        //공구 종료, 공구 품절 체크
        let groupbuying = await queryGroupBuying(req, db_connection);
        if (!groupbuying || groupbuying['is_authorized'] != 1) {
            errUtil.createCall(errCode.fail, `공동구매가 종료된 상품입니다.`)
            return
        }
        if (groupbuying['soldout'] == 1) {
            errUtil.createCall(errCode.fail, `공동구매 상품이 품절되었습니다.`)
            return
        }

        // console.log(req.paramBody['groupbuying_room_uid'])
        if(req.paramBody['groupbuying_room_uid'] != 0){
            console.log('공구방이 있으니 매칭 가능한지 확인')
            let groupbuyingRoom = await queryGroupBuyingRoom(req, db_connection);
            console.log(groupbuyingRoom)
            if (!groupbuyingRoom){
                errUtil.createCall(errCode.fail, `매칭이 해제된 방입니다. 다른 공동구매 방으로 입장하세요`)
                return
            }
            if (groupbuyingRoom['recruitment'] <= groupbuyingRoom['participants'] || groupbuyingRoom['status'] == 1) {
                errUtil.createCall(errCode.fail, `매칭이 완료된 방입니다. 다른 공동구매 방으로 입장하세요`)
                return
            }
        }


        let groupbuyingOption = await queryGroupBuyingOption(req, db_connection);
        if (!groupbuyingOption || groupbuyingOption['soldout'] == 1 ) {
            errUtil.createCall(errCode.fail, `옵션이 품절되었습니다.`)
            return
        }
        console.log(`구매수량: ${req.paramBody['count']}개`)
        console.log(`구매가능 수량: ${Number(groupbuyingOption['sales_quantity'])}개`)
        console.log(`구매시 수량: ${Number(groupbuyingOption['sales_quantity']) + Number(req.paramBody['count'])}개`)
        console.log(`재고: ${Number(groupbuyingOption['stock'])}개`)
        if (Number(groupbuyingOption['sales_quantity']) + Number(req.paramBody['count']) > Number(groupbuyingOption['stock']) ) {
            errUtil.createCall(errCode.fail, `구매하려는 수량보다 재고가 적습니다. 남은재고: ${Number(groupbuyingOption['stock']) - Number(groupbuyingOption['sales_quantity'])}개`)
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
        , 'call proc_select_filter_groupbuying_v1'
        , [
            req.paramBody['groupbuying_uid'],
        ]
    );
}

function queryGroupBuyingRoom(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_filter_groupbuying_room_v1'
        , [
            req.paramBody['groupbuying_room_uid'],
        ]
    );
}

function queryGroupBuyingOption(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_filter_groupbuying_option_v1'
        , [
            req.paramBody['groupbuying_option_uid'],
        ]
    );
}