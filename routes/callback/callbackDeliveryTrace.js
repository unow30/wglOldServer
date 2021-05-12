/**
 * Created by hyunhunhwang on 2021. 04. 23.
 */

const paramUtil = require('../../common/utils/paramUtil');
const fileUtil = require('../../common/utils/fileUtil');
const mysqlUtil = require('../../common/utils/mysqlUtil');
const sendUtil = require('../../common/utils/sendUtil');
const errUtil = require('../../common/utils/errUtil');
const logUtil = require('../../common/utils/logUtil');
const jwtUtil = require('../../common/utils/jwtUtil');

const errCode = require('../../common/define/errCode');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        // logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await query(req, db_connection);
            // logUtil.printUrlLog(req, `item: ${JSON.stringify(req.innerBody)}`);

            deleteBody(req)

            sendResult(res, true, 'success')
            // sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            // sendUtil.sendErrorPacket(req, res, err);
            sendResult(res, false, `fail - invalid ${!(err instanceof Error) ? err.stack : err.message}`)
        } );

    }
    catch (e) {
        let _err = errUtil.get(e);
        // res.status(400);
        sendResult(res, false, `fail - invalid ${!(e instanceof Error) ? e.stack : e.message}`)
        // sendUtil.sendErrorPacket(req, res, _err);
    }
}

function sendResult(res, code, msg){
    let retData = {}

    retData['code'] = code
    retData['message'] = msg

    res.send(retData);
}

function checkParam(req) {
    // paramUtil.checkParam_noReturn(req.paramBody, 'secret_value');
    // paramUtil.checkParam_noReturn(req.paramBody, 'fid');
    // paramUtil.checkParam_noReturn(req.paramBody, 'invoice_no');
    // paramUtil.checkParam_noReturn(req.paramBody, 'level');
    // paramUtil.checkParam_noReturn(req.paramBody, 'time_trans');
    // paramUtil.checkParam_noReturn(req.paramBody, 'time_sweet');
    // paramUtil.checkParam_noReturn(req.paramBody, 'where');
    // paramUtil.checkParam_noReturn(req.paramBody, 'telno_office');
    // paramUtil.checkParam_noReturn(req.paramBody, 'telno_man');
    // paramUtil.checkParam_noReturn(req.paramBody, 'details');
    // paramUtil.checkParam_noReturn(req.paramBody, 'recv_addr');
    // paramUtil.checkParam_noReturn(req.paramBody, 'recv_name');
    // paramUtil.checkParam_noReturn(req.paramBody, 'send_name');
    // paramUtil.checkParam_noReturn(req.paramBody, 'man');
    // paramUtil.checkParam_noReturn(req.paramBody, 'estmate');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call log_create_delivery_trace_log'
        , [
            req.paramBody['secret_value'],
            req.paramBody['fid'],
            req.paramBody['invoice_no'],
            req.paramBody['level'],
            req.paramBody['time_trans'],
            req.paramBody['time_sweet'],
            req.paramBody['where'],
            req.paramBody['telno_office'],
            req.paramBody['telno_man'],
            req.paramBody['details'],
            req.paramBody['recv_addr'],
            req.paramBody['recv_name'],
            req.paramBody['send_name'],
            req.paramBody['man'],
            req.paramBody['estmate'],
        ]
    );
}
