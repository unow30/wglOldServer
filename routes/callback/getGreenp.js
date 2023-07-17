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
        logUtil.printUrlLog(req, `response: ${JSON.stringify(res)}`);
        console.log(JSON.stringify(req.paramBody))

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

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