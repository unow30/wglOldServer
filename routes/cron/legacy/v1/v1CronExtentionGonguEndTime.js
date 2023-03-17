const fileUtil = require('../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../common/utils/legacy/origin/mysqlUtil');
const fcmUtil = require('../../../../common/utils/legacy/origin/fcmUtil');
const aligoUtil = require('../../../../common/utils/legacy/origin/aligoUtil');

const schedule = require('node-schedule');
const axios = require('axios');
const RestClient = require('@bootpay/server-rest-client').RestClient;

let file_name = fileUtil.name(__filename);

module.exports ={
    start: function(){
        /**
         * 매일 새벽 00:40 에 진행
         */
        schedule.scheduleJob('0 40 0 * * *', async function (){
        // schedule.scheduleJob('10 * * * * *', async function (){
            mysqlUtil.connectPool( async function (db_connection) {
                console.log('공구 종료일이 오늘보다 적으면 2달 연장한다. 쿼리만 실행한다.')
                const item = await queryGonguDeadline(db_connection);
            });
        });
    }
};

function queryGonguDeadline(db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call cron_gongu_extention_endtime_v1'
        , [
            // req.headers['user_uid'],
            // req.headers['access_token'],
        ]
    );
};

