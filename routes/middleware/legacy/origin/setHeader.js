/**
 * Created by hyunhunhwang on 2021. 02. 23.
 */
const paramUtil = require('../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../common/utils/legacy/origin/logUtil');
const jwtUtil = require('../../../../common/utils/legacy/origin/jwtUtil');

const errCode = require('../../../../common/define/errCode');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res, next) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        // console.log(`===>>> headers: ${JSON.stringify(req.headers)}`);
        // req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        req.headers['user_uid'] = 0
        if( paramUtil.checkParam_return(req.headers, 'access_token') ){
            let token = req.headers['access_token'];
            let data = jwtUtil.getPayload(token);
            req.headers['user_uid'] = data['uid'];
        }
        // else{
        //     return sendUtil.sendErrorPacket
        // }

    }
    catch (e) {
        // let _err = errUtil.get(e);
        // sendUtil.sendErrorPacket(req, res, _err);
    }
    finally{
        next()
    }
}
