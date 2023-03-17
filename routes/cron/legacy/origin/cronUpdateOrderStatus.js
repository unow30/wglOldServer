/**
 * Created by hyunhunhwang on 2021. 04. 12.
 */
const paramUtil = require('../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../common/utils/legacy/origin/logUtil');
const jwtUtil = require('../../../../common/utils/legacy/origin/jwtUtil');
const funcUtil = require('../../../../common/utils/legacy/origin/funcUtil');

const errCode = require('../../../../common/define/errCode');
const schedule = require('node-schedule');
const moment = require('moment');

let file_name = fileUtil.name(__filename);

module.exports ={
    start: function(){
        /**
         * 매일 새벽 03:30 에 진행
         */
        const job = schedule.scheduleJob('0 30 3 * * *', async function (){
        // const job = schedule.scheduleJob('0 * * * * *', async function (){
            console.log(`==>>> cronUpdateOrderStatus call date : ${moment().format('YYYY-MM-DD hh:mm:ss')}`)
            mysqlUtil.connectPool( async function (db_connection) {
                let innerBody = {};

                innerBody['order_list'] = await querySelectOrderList(db_connection);
                if( innerBody['order_list'] ){
                    innerBody['order_list'].map(async (item, idx) => {
                        let reward = await queryUpdate(item, db_connection);
                    })
                }
                // //유저 정보를 가져와서
                // if( !req.innerBody['item'] ){
                //     //유저 정보가 없으면 에러를 발생시킨다.
                //     errUtil.createCall(errCode.auth, `해당 유저의 접속 토큰이 유효하지 않습니다. 다시 로그인해 주세요.`);
                // }
                //사용자 정보를 확인하고 나서 api 기능을 실행하는 부분
                // next();
                // logUtil.printUrlLog(req, `item: ${JSON.stringify(req.innerBody['item'])}`);
                // sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

            }, function (err) {
                console.log(err)
                // console.log(`ERROR] cronUpdateOrderStatus err msg: ${JSON.stringify(err)}`)
                // sendUtil.sendErrorPacket(req, res, err);
            } );
        })
    }
}

function querySelectOrderList(db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call cron_select_reword_order_list'
        , [
            // req.headers['user_uid'],
            // req.headers['access_token'],
        ]
    );
}

function queryUpdate(item, db_connection) {
    const _funcName = arguments.callee.name;

    let reward_value = 0;  // 결제 금액의 5% 지급
    if( !isNaN(item['payment']) && item['payment'] > 0 ){
        reward_value = item['payment'] / 100 * 5;  // 결제 금액의 5% 지급
    }

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_reward'
        , [
            item['user_uid'],
            item['product_uid'],
            item['seller_uid'],
            item['video_uid'],

            item['order_uid'],
            reward_value,  // 결제 금액의 5% 지급
            `[${item['name']}] 리워드 적립`,
            // req.paramBody['status'],
        ]
    );
}
