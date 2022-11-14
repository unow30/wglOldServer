/**
 * Created by hyunhunhwang on 2021. 01. 02.
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

module.exports = function (req, res, next) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        // console.log(`===>>> headers: ${JSON.stringify(req.headers)}`);
        // req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        if(req.headers['user_uid'] == 0 ){
            //비회원일 경우 로그인을 유도 시킨다.
            errUtil.createCall(errCode.auth, `로그인 후 사용할 수 있는 페이지입니다.`);
        }
        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await querySelect(req, db_connection);
            //유저 정보를 가져와서
            console.log(req.innerBody['item'],'==============>>>유저 정보<<<==========')
            if( !req.innerBody.item ){
                //유저 정보가 없으면 에러를 발생시킨다.
                errUtil.createCall(errCode.auth, `해당 유저의 접속 토큰이 유효하지 않습니다. 다시 로그인해 주세요.`);
            }
            else{
                console.log('=======================================================================================================================================================');
                console.log('유저 토큰 검사');
                console.log('uid:',req.innerBody['item']['uid']);
                console.log('email:',req.innerBody['item']['email'],);
                console.log('email:',req.innerBody['item']['nickname'],);
                console.log('access_token:',req.innerBody['item']['access_token']);
                console.log('=======================================================================================================================================================');
            }
            
            //사용자 정보를 확인하고 나서 api 기능을 실행하는 부분
            next();
            // logUtil.printUrlLog(req, `item: ${JSON.stringify(req.innerBody['item'])}`);
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
    if( !paramUtil.checkParam_return(req.headers, 'access_token') ){
        errUtil.createCall(errCode.auth, `접속 토큰이 존재하지 않습니다. 다시 로그인해 주세요.`);
    }
    let token = req.headers['access_token'];
    try {
        //jwt 인증
        let data = jwtUtil.getPayload(token);
        console.log(data, '====================>>>>>>>>>>data')
        req.headers['user_uid'] = data['uid'];

        
    }
    catch (ex) {
        //세션이 만료되거나 인증이 되지 않으면 에러를 발생시켜서 에러를 catch
        errUtil.createCall(errCode.auth, `접속 토큰이 유효하지 않습니다. msg : ${ex.message}`);
    }
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_user_access_token_check'
        , [
            req.headers['user_uid'],
            req.headers['access_token'],
        ]
    );
}
