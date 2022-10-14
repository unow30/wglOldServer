const fileUtil = require('../../common/utils/fileUtil');
const mysqlUtil = require('../../common/utils/mysqlUtil');
const fcmUtil = require('../../common/utils/fcmUtil');
const aligoUtil = require('../../common/utils/aligoUtil');

const schedule = require('node-schedule');
const axios = require('axios');
const RestClient = require('@bootpay/server-rest-client').RestClient;

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

                let gonguRoomArr = ''; // drop
                let gonguRoomUserArr = ''; // drop
                let gonguArr = ''; // is_deleted = 1
                let orderProductArr = ''; // status = 51
                let orderArr = ''; // cancelable_reward or cancelable_price 0 으로 만들어줄 배열

                for(let i=0; i<item.length; i++){
                    let result = item[i]
                    console.log(result)
                    if(result.cancelable_reward>0 || result.cancelable_price>0){
                        let rewardInfo = {};
                        console.log('환불가능 금액=======>',result.cancelable_price)
                        if(result.cancelable_price>0){
                            //부트페이 실행
                            RestClient.setConfig(
                                process.env.BOOTPAY_APPLICATION_ID,
                                process.env.BOOTPAY_PRIVATE_KEY,
                            );
                            let token = await RestClient.getAccessToken();
                            console.log('token====>',token)

                            if (token.status === 200){
                                let bootRes = await RestClient.cancel({
                                    receiptId: result.pg_receipt_id,
                                    price: result.refund_payment,                               // "[[ 결제 취소할 금액 ]]"
                                    name: result.nickname,              // "[[ 취소자명 ]]"
                                    reason: '공동구매 매칭 취소'  // "[[ 취소사유 ]]"
                                })

                                if(bootRes.status === 200){
                                    orderProductArr+= result.order_product_uid+','
                                    orderArr+= result.order_uid+','
                                    gonguRoomUserArr+= result.group_buying_room_user_uid+','
                                    gonguRoomArr+= result.group_buying_room_uid+','
                                    gonguArr+= result.group_buying_uid+','
                                    userArr.push(result.user_token);

                                    if(result.cancelable_reward>0){
                                        rewardInfo = {
                                            user_uid: result.user_uid,
                                            seller_uid: result.seller_uid,
                                            order_uid: result.order_uid,
                                            order_no: result.order_no,
                                            state: 13,
                                            refund_reward: result.cancelable_reward,
                                            text: '환불로 인한 사용 리워드 롤백'
                                        }
                                        await queryRollbackReward(db_connection, rewardInfo);
                                        // 위 함수 살려야 함
                                    }
                                }
                            }
                        }
                        else{
                            rewardInfo = {
                                user_uid: result.user_uid,
                                seller_uid: result.seller_uid,
                                order_uid: result.order_uid,
                                order_no: result.order_no,
                                state: 13,
                                refund_reward: result.cancelable_reward,
                                text: '환불로 인한 사용 리워드 롤백'
                            }
                            console.log(rewardInfo)
                            await queryRollbackReward(db_connection, rewardInfo) // 리워드 환불
                            // 위 함수 살려야 함
                            orderProductArr+= result.order_product_uid+','
                            orderArr+= result.order_uid+','
                            gonguRoomUserArr+= result.group_buying_room_user_uid+','
                            gonguRoomArr+= result.group_buying_room_uid+','
                            gonguArr+= result.group_buying_uid+','
                            userArr.push(result.user_token)
                        }
                    }   
                }
                userArr = [...new Set(userArr)]; // push 토큰용

                /// 프로시저에서 find_in_set 위한 공백 다 삭제
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
                await queryGonguAndOrderUpdate(db_connection, gonguArr, orderProductArr, orderArr);
                
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
        , 'call cron_gongu_roon_user_drop_v1'
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

