/**
 * Created by gunucklee on 2021. 06. 28.
 *
 * @swagger
 * /api/private/order/status:
 *   put:
 *     summary: 상품 구매 상태 수정
 *     tags: [Order]
 *     description: |
 *       path : /정
 *
 *       * 상품 구매 상태 수정
 *         * 구매 상태 값 {5: 구매 확정, 6: 구매 취소, 10: 반품 신청, 20: 교환 신청}
 *         * 주문한 user_uid의 access Token 으로 접속해야 합니다. 그렇지 않으면 쳇바퀴가 돕니다.
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
 *           $ref: '#/definitions/OrderStatusApi'
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
const fcmUtil = require('../../../common/utils/fcmUtil');

const errCode = require('../../../common/define/errCode');

const moment = require('moment');


let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);

        req.paramBody = paramUtil.parse(req);
        req.paramBody['detail_reason'] = req.paramBody['detail_reason'].replace(/\n/g, '\\n')
        req.paramBody['detail_reason'] = req.paramBody['detail_reason'].replace(/\t/g, '\\t')

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};


            let data = await queryStatus(req, db_connection);
            if(data['status'] === 5 && data['status'] == req.paramBody['status']){
                errUtil.createCall(errCode.param, `구매확정된 상품입니다.`)
                return
            }

            req.innerBody['item'] = await query(req, db_connection);
            // console.table(req.innerBody['item']['status'])
            let alertList = await queryAlertComment(req, db_connection);


            if(req.innerBody['item']) {

                switch (req.paramBody['status']) {

                    case 5:
                        //구매확정알림을 판매자에게 보내야 한다. 내용을 저장하지는 않는다.
                        if(alertList['is_alert_order_confirm'] == 0){
                            await fcmUtil.fcmOrderProductConfirm(req.innerBody['item'])
                        }
                        if( req.innerBody['item']['video_uid'] > 0 && req.innerBody['item']['type'] == 2 ) {
                            req.innerBody['reward'] = await queryUpdate(req, db_connection, req.innerBody['item']);
                            let fcmReward = await fcmUtil.fcmRewardVideoSingle(req.innerBody['reward'])
                            await queryInsertFCM(fcmReward['data'], db_connection)
                        }
                        //공구방의 참가가능인원(타입) 참가인원중 구매확정한 인원의 수를 가져온다.
                        //공구방의 방장 uid와 order_no를 가져온다. 방장이 나가면 데이터가 drop이라 이 데이터가 없다.
                        let count = await queryConfirm(req, db_connection)
                        // console.table(count)

                        //참가가능인원이 2,5,10일때 구매확정 인원이 2,3,5일때 포인트를 제공한다.
                        //한번에 바뀌면 어떻하지? 크론으로 구매확정이 동시에 이뤄진다면?
                        //방장이 있을경우만 작동
                        if(count['confirm_count'] == 2 && count['recruitment'] == 2){
                            //포인트 1000 제공
                            await queryPoint(count, db_connection, 1000)
                            console.log('포인트 1000 제공')
                        }

                        if(count['confirm_count'] == 3 && count['recruitment'] == 5){
                            //포인트 2000 제공
                            await queryPoint(count, db_connection, 2000)
                            console.log('포인트 2000 제공')
                        }

                        if(count['confirm_count'] == 5 && count['recruitment'] == 10){
                            //포인트 5000 제공
                            await queryPoint(count, db_connection, 5000)
                            console.log('포인트 5000 제공')
                        }

                        break;

                    case 6:
                        // req.innerBody['data'] = await queryOrderReturn(req, db_connection);
                        // req.innerBody['reward'] = await queryCancelable(req, db_connection);
                        console.log("어디까지오니2")
                        if(req.innerBody['item']['refund_reward'] > 0) {
                            await queryRollbackReward(req, db_connection)
                        }
                        break;
                    
                    case 51:
                        // 1명있는 방일경우 유저, 룸 drop
                        // 1명 이상 있는 방일경우 유저 drop 및 room 참가인원 -1
                        // order gongu_room_uid 0으로 변경 및 order_products status 51로 변경
                        // 취소금액 환불 및 리워드 환급
                        const gongu123 = await querySelectRoomUser(req, db_connection);
                        console.log(gongu123)
                        console.log('111들어옴')
                        if(gongu123.participants == 1){
                            await queryDropGongu(gongu123, db_connection);
                        }
                        else{
                            await queryUpdateGongu(gongu123, db_connection);
                        }

                        if(req.innerBody['item']['refund_reward'] > 0) {
                            console.log('들어왔다')
                            await queryRollbackReward(req, db_connection);

                        }

                        break;



                }
                        // await queryCancel(req, db_connection, req.innerBody['item']);

            }


            console.log("어디까지오니3")



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
        req.paramBody['status'] === 10 || req.paramBody['status'] === 20 ||
        req.paramBody['status'] === 51) ) {
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
            item['reward_user_uid'],
            item['product_uid'],
            item['seller_uid'],
            item['video_uid'],
            item['order_uid'],
            item['order_no'],
            reward_value,  // 결제 금액의 5% 지급
            `[${item['name']}] 리워드 적립`,
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
            req.innerBody['item']['user_uid'],
            req.innerBody['item']['seller_uid'],
            req.innerBody['item']['order_uid'],
            req.innerBody['item']['order_no'],
            13,
            req.innerBody['item']['refund_reward'],
            '환불로 인한 사용 리워드 롤백',
        ]

    );
}


function queryInsertFCM(data, db_connection){

    return mysqlUtil.querySingle(db_connection
        ,'call proc_create_fcm_data'
        , [
            data['user_uid'],
            data['alarm_type'],
            data['title'],
            data['message'],
            data['video_uid'] == null? 0 : data['video_uid'],
            data['target_uid'] == null? 0 : data['target_uid'],
            data['icon_filename']
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


function queryStatus(req, db_connection, item) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_order_product_status'
        , [
            req.paramBody['order_product_uid']
        ])
}

function queryAlertComment(req, db_connection){

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_alert_list'
        , [
            req.innerBody['item']['seller_uid']
        ]
    )
}

function queryConfirm(req, db_connection){
    return mysqlUtil.querySingle(db_connection
        , 'call select_groupbuyingroomuser_confirm_count_v1'
        , [
            req.innerBody['item']['group_buying_room_uid']
        ]
    )
}

function queryPoint(data, db_connection, point) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_use_point'
        , [
            data['user_uid'], //헤드에게 포인트를 줘야한다.
            data['order_no'], //헤드의 주문번호
            1, //지급
            point,
            `공동구매 ${point}포인트 제공`
        ]
    );
}
function querySelectRoomUser(req, db_connection){
    console.log(req.headers['user_uid'], req.paramBody['order_uid'])
    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_order_update_room_user_v1'
        , [
            req.headers['user_uid'], req.paramBody['order_uid']
        ]
    )
}

function queryDropGongu(data, db_connection){

    return mysqlUtil.querySingle(db_connection
        , 'call proc_delete_gongu_room_user_v1'
        , [
            data.order_uid, // order gongu_room_uid 0으로 변경 
            data.order_product_uid, // order_products status 51로 변경
            data.group_buying_room_uid, // 삭제
            data.group_buying_room_user_uid // 삭제
        ]
    )
}

function queryUpdateGongu(data, db_connection){

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_gongu_room_user_v1'
        ,[
            data.order_uid, // order gongu_room_uid 0으로 변경 
            data.order_product_uid, // order_products status 51로 변경
            data.group_buying_room_uid, // participants -1해서 room 업데이트
            data.group_buying_room_user_uid // 삭제
        ]
    )
}