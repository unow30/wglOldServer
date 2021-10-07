/**
 * Created by yunhokim on 2021. 10. 07.
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
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);
        console.log(JSON.stringify(req.paramBody))
        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};


            req.innerBody['item'] = await query(req, db_connection);
            console.log('ststus값은 확인')
            console.log(req.paramBody['status'])
            // req.innerBody['item'] = await queryUpdate(req, db_connection);

            deleteBody(req);
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

function checkParam(req) {

}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    //let user_uid = req.headers['user_uid'] ? req.headers['user_uid'] : 0;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_virtual_account'
        , [
            req.headers['user_uid'],
            req.paramBody['receipt_id'],
            req.paramBody['order_id'],
            req.paramBody['name'],
            req.paramBody['price'],
            req.paramBody['unit'],
            req.paramBody['pg'],
            req.paramBody['method'],
            req.paramBody['pg_name'],
            req.paramBody['method_name'],
            // req.paramBody['payment_data'],
            req.paramBody['requested_at'],
            req.paramBody['purchased_at'],
            req.paramBody['status'],
        ]
    );
}

