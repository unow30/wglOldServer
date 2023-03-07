const paramUtil = require('../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../common/utils/legacy/origin/logUtil');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            const list = await query(req, db_connection);
            console.log(124)
            for(let i=0; i<list.length; i++){
                console.log(i)
                const sql = `
                    update tbl_reward
                    set product_amount = ${list[i].payment}
                    where uid = ${list[i].uid}
                `
                await db_connection.query(sql)
            }

            req.innerBody['item']='success'
            
            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });

    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}



function query(req, db_connection) {
    const _funcName = arguments.callee.name;
    console.log(123)
    return mysqlUtil.queryArray(db_connection
        , 'call proc_dev_reward_product_amount_list'
        , [
        ]
    );
}