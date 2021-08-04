/**
 * Created by gunucklee on 2021. 06. 28.
 *
 * @swagger
 * /api/private/order/status:
 *   put:
 *     summary: 상품 구매 상태 수정
 *     tags: [Order]
 *     description: |
 *       path : /api/private/order/status
 *
 *       * 상품 구매 상태 수정
 *         * 구매 상태 값 {5: 구매 확정, 6: 구매 취소, 10: 반품 신청, 20: 교환 신청}
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           상품 구매 상태 수정
 *         schema:
 *           type: object
 *           required:
 *             - order_uid
 *             - order_product_uid
 *             - status
 *           properties:
 *             order_uid:
 *               type: number
 *               example: 0
 *               description: |
 *                 구매취소 시 order_uid
 *             order_product_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 구매확정할 구매상품 uid
 *             status:
 *               type: number
 *               example: 5
 *               description: |
 *                 구매 상태 값
 *                 * 5: 구매 확정
 *                 * 6: 구매 취소
 *                 * 10: 반품 신청
 *                 * 20: 교환 신청
 *               enum: [5,6,10,20]
 *             cancel_reason:
 *               type: string
 *               example: 반환 사유
 *               description:
 *             detail_reason:
 *               type: string
 *               example: 반환 상세 사유
 *               description:
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/Order'
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

const moment = require('moment');


let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);

        req.paramBody = paramUtil.parse(req);


        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await query(req, db_connection);


            if(req.innerBody['item']) {

                switch (req.paramBody['status']) {

                    case 5:
                        let reward = await queryUpdate(req, db_connection, req.innerBody['item']);
                        break;

                    case 6:
                        // req.innerBody['data'] = await queryOrderReturn(req, db_connection);
                        // req.innerBody['reward'] = await queryCancelable(req, db_connection);

                        if(req.innerBody['item']['refund_reward'] > 0) {
                            await queryRollbackReward(req, db_connection)
                        }



                }
                        // await queryCancel(req, db_connection, req.innerBody['item']);

            }






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
    paramUtil.checkParam_noReturn(req.paramBody, 'order_product_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'status');


    if( !req.paramBody['cancel_reason']) {
        req.paramBody['cancel_reason'] = '';
    }
    if( !req.paramBody['detail_reason']) {
        req.paramBody['detail_reason'] = '';
    }

    if( !(req.paramBody['status'] === 5 || req.paramBody['status'] === 6 ||
        req.paramBody['status'] === 10 || req.paramBody['status'] === 20  ) ) {
        errUtil.createCall(errCode.param, `파라미터 오류 발생. 파라미터를 확인해 주세요.\n확인 파마리터 : status 취소/확정 만 가능`);
    }

}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['product']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_order_status'
        , [
            req.headers['user_uid'],
            req.paramBody['order_product_uid'],
            req.paramBody['status'],
            req.paramBody['cancel_reason'],
            req.paramBody['detail_reason'],
        ]
    );
}

function queryUpdate(req, db_connection, item) {
    const _funcName = arguments.callee.name;

    let reward_value = 0;  // 결제 금액의 5% 지급
    if( !isNaN(item['payment']) && item['payment'] > 0 ){
        reward_value = item['payment'] / 100 * 5;  // 결제 금액의 5% 지급
    }

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_reward'
        , [
            req.headers['user_uid'],
            item['product_uid'],
            item['seller_uid'],
            item['video_uid'],

            item['order_uid'],
            reward_value,  // 결제 금액의 5% 지급
            `[${req.innerBody['name']}] 리워드 적립`,
            // req.paramBody['status'],
        ]
    );
}


function queryCancelCheck(req, db_connection, item) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_cancel_check'
        , [
            item['order_uid']
        ])
}




// function queryCancelable(req, db_connection) {
//     const _funcName = arguments.callee.name;
//
//     return mysqlUtil.querySingle(db_connection
//         , 'call proc_update_cancelable'
//         , [
//             req.paramBody['order_uid'],
//             req.innerBody['item']['payment'],
//             req.paramBody['order_product_uid'],
//         ]
//
//     );
// }


function queryRollbackReward(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call w_seller_update_rollback_reward'
        , [
            req.innerBody['item']['product_uid'],
            req.innerBody['item']['user_uid'],
            req.innerBody['item']['seller_uid'],
            req.innerBody['item']['video_uid'],
            req.innerBody['item']['order_uid'],
            req.innerBody['item']['order_no'],
            1,
            req.innerBody['item']['refund_reward'],
            '환불로 인한 사용 리워드 롤백',
        ]

    );
}



// // 전체 취소를 해야지만 리워드 환불이 적용됩니다.
// function queryCancel(req, db_connection, item) {
//     const _funcName = arguments.callee.name;
//
//     const currentDate = moment().format("YYYY-MM-DD HH:mm:ss");
//
//     console.log("currentDate: " + currentDate)
//
//     const elapsedMin = ( currentDate - item['created_time'] ) / 1000 / 60;
//
//
//     console.log("elapsedMin: " + elapsedMin)
//
//     if(elapsedMin < 0 || elapsedMin > 30)
//         return;
//
//
//     return mysqlUtil.querySingle(db_connection
//         , 'call proc_cancel_reward'
//         , [
//             item['order_uid'],
//             item['order_product_uid']
//         ])
//
//
// }
//
