/**
 * Created by gunucklee on 2021. 11. 25.
 */
const paramUtil = require('../../common/utils/paramUtil');
const fileUtil = require('../../common/utils/fileUtil');
const mysqlUtil = require('../../common/utils/mysqlUtil');
const sendUtil = require('../../common/utils/sendUtil');
const errUtil = require('../../common/utils/errUtil');
const logUtil = require('../../common/utils/logUtil');
const jwtUtil = require('../../common/utils/jwtUtil');
const funcUtil = require('../../common/utils/funcUtil');
const app = require('../../app');

const errCode = require('../../common/define/errCode');
const schedule = require('node-schedule');
const fcmUtil = require('../../common/utils/fcmUtil');
const axios = require('axios');
axios.defaults.headers.common['Authorization'] = 'key=AAAAH1HxpKo:APA91bEGjPgOgXK2xZ-uqZHiR_PT69tO4knZt6ZCRpAXRESsnuY23MXWFneIQ-EALixYNkcUZg0iNczMW8eXc9ZLp6_dd1Kmz0t4rw5rJwboLwG-65hS0nyNps5OchEw72zP8dzlLNIa';
axios.defaults.headers.post['Content-Type'] = 'application/json';



let file_name  = fileUtil.name(__filename);
module.exports ={
    start: function(){
        //매일 새벽 00:00 에 진행
        try{
            const job = schedule.scheduleJob('0 0 13 * * *', function (){
                mysqlUtil.connectPool(async function (db_connection) {
                    let item ={};
                    console.log("ㅁㅇㄴ");
                    item = await query(db_connection);
                    console.log('선물하기 자동취소 진행')
                    for( let idx in item ){
                        console.log('선물하기 취소 데이터 '+idx + ': ' + JSON.stringify(item[idx]));
                        await fcmUtil.fcmGiftOvertimeSingle(item[idx]); //선물유효기간 1주일 지남. 구매자에게 취소부탁
                        // let bootpay_response = await axios.put('http://localhost:3456/api/public/order/cancel/gift', {
                        let bootpay_response = await axios.put('52.78.124.248/api/public/order/cancel/gift', {
                                "order_uid": item[idx]['order_uid'],
                                "order_product_uid": item[idx]['order_product_uid'],
                                "gift_uid": item[idx]['uid'], //gift_uid
                                "status": item[idx]['order_product_status'],
                                "user_uid": item[idx]['source_uid'] //선물환불시 구매한 유저uid 필요
                        })

                    }

                }, function (err) {
                    console.log(err)
                });
            });
        }
        catch (err) {
            console.log(err)
        }
    }
}

function query(db_connection) {
    const  _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call cron_select_gift_overtime'
        , []
    );
}
