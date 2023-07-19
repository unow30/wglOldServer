/**
 * Created by yunhokim on 2021. 10. 07.
 */
const paramUtil = require('../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../common/utils/legacy/origin/logUtil');
const jwtUtil = require('../../common/utils/legacy/origin/jwtUtil');

const errCode = require('../../common/define/errCode');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            await createGreenpLog(req, db_connection);

            await createQueryPoint(req, db_connection);

            res.send('OK')
            // sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        } );
    }
    catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

async function createQueryPoint(req, db_connection){
    let {etc, rwd_cost, ads_name} = req.paramBody

    if (typeof rwd_cost === 'number' && rwd_cost.toString().indexOf('.') !== -1) {
        rwd_cost = Math.ceil(rwd_cost)
    }

    const query = `
        insert into tbl_point
        set ?
    ;
    `;

    const newRecord = {
        user_uid: etc,
        type: 1,
        amount: rwd_cost,
        content: '그린피 포인트 제공: ['+ads_name+']',
    };

    return new Promise(async(resolve, reject) => {
        db_connection.query(query, newRecord, async (err, rows, fields) =>{
            if(err){
                reject(err);
            }else{
                resolve(true)
            }
        });
    });
}

async function createGreenpLog(req, db_connection){
    let {ads_idx, ads_name, rwd_cost, etc, app_uid, gp_key} = req.paramBody

    if (typeof rwd_cost === 'number' && rwd_cost.toString().indexOf('.') !== -1) {
        rwd_cost = Math.ceil(rwd_cost)
    }

    const query = `
        insert into log_greenp_trace
        set ?
    ;
    `;

    const newRecord = {
        ads_idx: ads_idx,
        ads_name: ads_name,
        rwd_cost: rwd_cost,
        etc: etc,
        app_uid: app_uid,
        gp_key: gp_key
    };

    return new Promise(async(resolve, reject) => {
        db_connection.query(query, newRecord, async (err, rows, fields) =>{
            if(err){
                reject(err);
            }else{
                resolve(true)
            }
        });
    });
}