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

            await createQueryPoint(req, db_connection)

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
    const query = `
        insert into tbl_point as p
        into p.user_uid = ?,
        p.type = 1,
        p.amount = ?,
        p.content = ?
    ;
    `;
    return new Promise(async(resolve, reject) => {
        db_connection.query(query, [req.headers['user_uid'], req.paramBody['rwd_cost'], req.paramBody['ads_name']], async (err, rows, fields) =>{
            if(err){
                reject(err);
            }else{
                resolve(true)
            }
        });
    });
}