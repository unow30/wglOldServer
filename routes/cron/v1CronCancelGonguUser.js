const fileUtil = require('../../common/utils/fileUtil');
const mysqlUtil = require('../../common/utils/mysqlUtil');
const fcmUtil = require('../../common/utils/fcmUtil');
const aligoUtil = require('../../common/utils/aligoUtil');

const schedule = require('node-schedule');
const axios = require('axios');
const RestClient = require('@bootpay/server-rest-client').RestClient;

let file_name = fileUtil.name(__filename);

module.exports ={
    start: async function(){
        /**
         * 매일 새벽 00:30 에 진행
         */
        schedule.scheduleJob('0-59 * * * * *', async function (){
            mysqlUtil.connectPool( async function (db_connection) {
                const item = await queryGonguDeadline(db_connection);

                let gonguRoomArr = []; // is_deleted = 1
                let gonguArr = []; // is_deleted = 1
                let orderProductArr = []; // status = 6
                let userArr = []; // fcm알람때문에
                let rewardArr = []; //
                let orderArr = []; // cancelable_reward or cancelable_price 0 으로 만들어줄 배열
                let bootPayArr = [];

                const itemData = item.map(result=>{
                    gonguRoomArr.push(result.group_buying_room_uid)
                    gonguArr.push(result.group_buying_uid)
                    

                    return {
                        cancelable_reward: result.cancelable_reward,
                        cancelable_price: result.cancelable_price,
                        price_total: result.price_total,
                        price_payment: result.price_payment,
                        order_uid: result.order_uid,
                        order_product_uid: result.order_product_uid,
                        group_buying_room_uid: result.group_buying_room_uid,
                        group_buying_uid: result.group_buying_uid,
                        user_uid: result.user_uid,
                        refund_payment: result.refund_payment,
                        pg_receipt_id: result.pg_receipt_id,
                        nickname: result.nickname
                    }
                });

                for(let i=0; i<itemData.length; i++){
                    let result = itemData[i]

                    if(result.cancelable_reward>0 || result.cancelable_price>0){
                        if(result.refund_payment>0){
                            //부트페이 실행
                            RestClient.setConfig(
                                process.env.BOOTPAY_APPLICATION_ID,
                                process.env.BOOTPAY_PRIVATE_KEY,
                            );
                            let token = await RestClient.getAccessToken();

                            if (token.status === 200){
                                let bootRes = await RestClient.cancel({
                                    receiptId: result.pg_receipt_id,
                                    price: result.refund_payment,                               // "[[ 결제 취소할 금액 ]]"
                                    name: result.nickname,              // "[[ 취소자명 ]]"
                                    reason: '공동구매 매칭 취소'  // "[[ 취소사유 ]]"
                                })

                                if(bootRes.status === 200){
                                    orderProductArr.push(result.order_product_uid)
                                    userArr.push(result.user_token)
                                    orderArr.push(result.order_uid);
                                }
                                if(result.cancelable_reward>0){
                                    // 리워드 벌크 인서트 로직 추가되어야 함
                                }
                            }
                        }
                        else{
                            // 리워드 벌크 인서트 로직 추가되어야 함
                            orderProductArr.push(result.order_product_uid);
                            userArr.push(result.user_token);
                            orderArr.push(result.order_uid);
                        }
                    }   
                }


                gonguRoomArr = [...new Set(gonguRoomArr)];
                gonguArr = [...new Set(gonguArr)];
                userArr = [...new Set(userArr)];
                // await queryGonguEndUpdate(db_connection, gonguRoomArr, gonguArr, orderProductArr);
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('gonguRoomArr===',gonguRoomArr)
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('gonguArr===',gonguArr)
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('sellerArr===',sellerArr)
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');
                console.log('orderProductArr===',orderProductArr)
                console.log('==============>>>>>>>>>============>>>>>>>>>>>===========');

                //공구 룸 삭제, 공구 삭제, 오더프로덕트 결제취소, 공구유저 fcm
            }, function (err) {
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

function queryGonguEndUpdate(db_connection, gonguRoom, gongu, orderProduct) {
    const gonguRoomData = JSON.stringify(gonguRoom);
    const gonguData = JSON.stringify(gongu);
    const orderProductData = JSON.stringify(orderProduct);

    return mysqlUtil.queryArray(db_connection
        , 'call cron_gongu_end_update_v1'
        , [
            gonguRoomData,
            gonguData,
            orderProductData,
        ]
    );
};

async function alarm(req, res) {

    const push_token_list = Array.from(new Set(req.innerBody['push_token_list']))
    await fcmUtil.fcmCreateOrderList(push_token_list);

}

