const fileUtil = require('../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../common/utils/legacy/origin/mysqlUtil');
const fcmUtil = require('../../../../common/utils/legacy/origin/fcmUtil');
const aligoUtil = require('../../../../common/utils/legacy/origin/aligoUtil');

const schedule = require('node-schedule');
const axios = require('axios');
// const RestClient = require('@bootpay/server-rest-client').RestClient;
const RestClient = require('../../../../common/utils/v3/bootpay/bootpayConfig').setConfigBootpayV1()


let file_name = fileUtil.name(__filename);

module.exports ={
    start: function(){
        /**
         * 매일 새벽 00:30 에 진행
         */
        schedule.scheduleJob('0 30 0 * * *', async function (){
            mysqlUtil.connectPool( async function (db_connection) {
                const item = await queryGonguDeadline(db_connection);

                let userArr = []; // fcm알람때문에
                let gonguRoomArr = []; // drop
                let gonguRoomUserArr = []; // drop
                let gonguArr = []; // is_deleted = 1
                let orderProductArr = []; // status = 51
                let orderArr = []; // cancelable_reward or cancelable_price 0 으로 만들어줄 배열

                const itemData = item.map(async result =>{
                    console.log(result)
                    if(result.cancelable_reward>0 || result.cancelable_price>0){
                        if(result.cancelable_price>0){ // 환불해줄 실 결제금액이 있을 경우 부트페이 거칠때 로직
                            RestClient.setConfig(
                                process.env.BOOTPAY_APPLICATION_ID,
                                process.env.BOOTPAY_PRIVATE_KEY,
                            );
                            const token = await RestClient.getAccessToken();

                            if (token.status === 200){
                                // let bootRes = await RestClient.cancel({
                                const cancelResponse = await RestClient.cancel({
                                    receiptId: result.pg_receipt_id,
                                    price: result.refund_payment,    // "[[ 결제 취소할 금액 ]]"
                                    name: result.nickname,           // "[[ 취소자명 ]]"
                                    reason: '공동구매 매칭 취소'         // "[[ 취소사유 ]]"
                                })

                                if(cancelResponse.status === 200){ // 부트페이 취소가 잘 되었을때

                                    orderProductArr.push(result.order_product_uid);
                                    orderArr.push(result.order_uid);
                                    gonguRoomUserArr.push(result.group_buying_room_user_uid);
                                    gonguRoomArr.push(result.group_buying_room_uid);
                                    gonguArr.push(result.group_buying_uid);
                                    userArr.push(result.user_token);


                                    if(result.cancelable_reward>0){ // 리워드 롤백 로직 및 데이터
                                        const rewardInfo = {
                                            user_uid: result.user_uid,
                                            seller_uid: result.seller_uid,
                                            order_uid: result.order_uid,
                                            order_no: result.order_no,
                                            state: 13,
                                            refund_reward: result.cancelable_reward,
                                            text: '환불로 인한 사용 리워드 롤백'
                                        }
                                        await queryRollbackReward(db_connection, rewardInfo);
                                    }
                                }
                                else{ // 부트페이 취소가 잘 안되었을때
                                    console.log(`부트페이 결제취소 실패===> order_uid:${result.order_uid}`)
                                    console.log('부트페이 결제취소 실패 리스폰스===>',cancelResponse)
                                }
                            }

                            
                        }
                        else{ // 환불해줄 실 결제금액이 없을 경우 부트페이 안거칠때 로직
                            if(result.cancelable_reward>0){ // 리워드 롤백 로직 및 데이터

                                orderProductArr.push(result.order_product_uid);
                                orderArr.push(result.order_uid);
                                gonguRoomUserArr.push(result.group_buying_room_user_uid);
                                gonguRoomArr.push(result.group_buying_room_uid);
                                gonguArr.push(result.group_buying_uid);
                                userArr.push(result.user_token);
                                
                                const rewardInfo = {
                                    user_uid: result.user_uid,
                                    seller_uid: result.seller_uid,
                                    order_uid: result.order_uid,
                                    order_no: result.order_no,
                                    state: 13,
                                    refund_reward: result.cancelable_reward,
                                    text: '환불로 인한 사용 리워드 롤백'
                                }
                                await queryRollbackReward(db_connection, rewardInfo);
                            }
                        }
                    }
                })
                await Promise.all(itemData)

                userArr = [...new Set(userArr)]; // push 토큰용
                gonguRoomArr = gonguRoomArr.join(',') // 프로시저에서 finde in set 사용하기 위해 문자열로 변환 예)"1,2,3,4"
                gonguRoomUserArr = gonguRoomUserArr.join(',')
                gonguArr = gonguArr.join(',')
                orderProductArr = orderProductArr.join(',')
                orderArr = orderArr.join(',')

                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('gonguRoomArr===',gonguRoomArr)
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('gonguArr===',gonguArr)
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('userArr===',userArr)
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('orderProductArr===',orderProductArr)
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('orderArr===',orderArr)
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('gonguRoomUserArr===',gonguRoomUserArr)
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');

                await queryGonguDrop(db_connection, gonguRoomArr, gonguRoomUserArr);
                console.log('공구 드롭')
                await queryGonguAndOrderUpdate(db_connection, gonguArr, orderProductArr, orderArr);
                console.log('공구, 오더 업데이트')
                if(userArr.length > 0){
                    await alarm(userArr);
                    console.log('취소 크론 끝')
                }
                //공구 룸 삭제, 공구 삭제, 오더프로덕트 결제취소, 공구유저 fcm
            }, function (err) {
                console.log('에러 들어왔다')
                console.log(err)
            } );
        });
    }
};

function queryGonguDeadline(db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call cron_gongu_deadline_v1'
        , [
            // req.headers['user_uid'],
            // req.headers['access_token'],
        ]
    );
};

function queryGonguDrop(db_connection, gonguRoom, gonguRoomUser) {
    return mysqlUtil.queryArray(db_connection
        , 'call cron_gongu_room_user_drop_v1'
        , [
            gonguRoom,
            gonguRoomUser,
        ]
    );
};

function queryGonguAndOrderUpdate(db_connection, gongu, orderProduct, order) {
    return mysqlUtil.queryArray(db_connection
        , 'call cron_gongu_and_order_update_v1'
        , [
            gongu,
            orderProduct,
            order,
        ]
    );
};

function queryRollbackReward(db_connection, rewardInfo) {
    const _funcName = arguments.callee.name;
    console.log('여긴 함수 안!!',rewardInfo)
    return mysqlUtil.querySingle(db_connection
        , 'call cron_gongu_update_rollback_reward_v1'
        , [
            rewardInfo.user_uid,
            rewardInfo.seller_uid,
            rewardInfo.order_uid,
            rewardInfo.order_no,
            rewardInfo.state,
            rewardInfo.refund_reward,
            rewardInfo.text,
        ]
    );
}

async function alarm(userList) {
    await fcmUtil.fcmGonguCancelList(userList);

}

