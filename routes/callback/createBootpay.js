// const paramUtil = require('../../../common/utils/paramUtil');
// const fileUtil = require('../../../common/utils/fileUtil');
// const mysqlUtil = require('../../../common/utils/mysqlUtil');
// const sendUtil = require('../../../common/utils/sendUtil');
// const errUtil = require('../../../common/utils/errUtil');
// const logUtil = require('../../../common/utils/logUtil');
// const jwtUtil = require('../../../common/utils/jwtUtil');
//
// const errCode = require('../../../common/define/errCode');
//
// let file_name = fileUtil.name(__filename);
//
// module.exports = function (req, res) {
//     const _funcName = arguments.callee.name;
//
//     try{
//         req.file_name = file_name;
//         // logUtil.printUrlLog(req, `== function start ==================================`);
//         logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
//         req.paramBody = paramUtil.parse(req);
//         logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);
//         console.log(JSON.stringify(req.paramBody))
//         checkParam(req);
//
//         // mysqlUtil.connectPool( async function (db_connection) {
//         //     req.innerBody = {};
//         //
//         //     req.innerBody['item'] = await queryCheck(req, db_connection);
//         //     if( req.innerBody['item'] ){
//         //         errUtil.createCall(errCode.already, `이미 회원가입한 유저입니다.`)
//         //         return
//         //     }
//         //
//         //     let email_data = await queryCheckEmail(req, db_connection);
//         //     if( email_data ){
//         //         errUtil.createCall(errCode.already, `이미 가입한 이메일 입니다.`)
//         //         return
//         //     }
//         //     let nickname_count_data = await queryCheckNickname(req, db_connection);
//         //     if( nickname_count_data['count'] > 0 ){
//         //         errUtil.createCall(errCode.already, `이미 사용중인 닉네임 입니다.`)
//         //         return
//         //     }
//         //
//         //     req.innerBody['item'] = await query(req, db_connection);
//         //     req.innerBody['item']['access_token'] = jwtUtil.createToken(req.innerBody['item'], '100d');
//         //     // req.innerBody['item'] = await queryUpdate(req, db_connection);
//         //     await queryUpdate(req, db_connection);
//         //
//         //
//         //     req.paramBody['filename']  =  (req.paramBody['filename'] && req.paramBody['filename'].length >= 4) ?
//         //         req.paramBody['filename'] : "profile_default_image.png"
//         //     await queryUpdateImage(req, db_connection);
//         //
//         //
//         //
//         //     deleteBody(req);
//          res.send("OK")
//         //
//         // }, function (err) {
//         //     sendUtil.sendErrorPacket(req, res, err);
//         // } );
//
//     }
//     catch (e) {
//         let _err = errUtil.get(e);
//         sendUtil.sendErrorPacket(req, res, _err);
//     }
// }
//
// function checkParam(req) {
//     paramUtil.checkParam_noReturn(req.paramBody, 'signup_type');
//     paramUtil.checkParam_noReturn(req.paramBody, 'social_id');
//     paramUtil.checkParam_noReturn(req.paramBody, 'email');
//     paramUtil.checkParam_noReturn(req.paramBody, 'nickname');
//     paramUtil.checkParam_noReturn(req.paramBody, 'about');
//     paramUtil.checkParam_noReturn(req.paramBody, 'interests');
//     paramUtil.checkParam_noReturn(req.paramBody, 'age');
//     paramUtil.checkParam_noReturn(req.paramBody, 'gender');
//     paramUtil.checkParam_noReturn(req.paramBody, 'push_token');
//     paramUtil.checkParam_noReturn(req.paramBody, 'os');
//     paramUtil.checkParam_noReturn(req.paramBody, 'version_app');
// }
//
// function deleteBody(req) {
//     // delete req.innerBody['item']['latitude']
//     // delete req.innerBody['item']['longitude']
//     // delete req.innerBody['item']['push_token']
// }
//
// function query(req, db_connection) {
//     const _funcName = arguments.callee.name;
//
//     //let user_uid = req.headers['user_uid'] ? req.headers['user_uid'] : 0;
//
//     return mysqlUtil.querySingle(db_connection
//         , 'call proc_create_user'
//         , [
//             req.paramBody['signup_type'],
//             req.paramBody['social_id'],
//             req.paramBody['email'],
//             req.paramBody['nickname'],
//             req.paramBody['about'],
//             req.paramBody['interests'],
//             req.paramBody['gender'],
//             req.paramBody['age'],
//             req.paramBody['push_token'],
//             req.paramBody['os'],
//             req.paramBody['version_app'],
//         ]
//     );
// }
//
// function queryCheck(req, db_connection) {
//     const _funcName = arguments.callee.name;
//
//     return mysqlUtil.querySingle(db_connection
//         , 'call proc_select_user_signup_check'
//         , [
//             req.paramBody['signup_type'],
//             req.paramBody['social_id'],
//         ]
//     );
// }
//
// function queryCheckNickname(req, db_connection) {
//     const _funcName = arguments.callee.name;
//
//     return mysqlUtil.querySingle(db_connection
//         , 'call proc_select_user_nickname_check'
//         , [
//             0,
//             req.paramBody['nickname'],
//         ]
//     );
// }
//
// function queryCheckEmail(req, db_connection) {
//     const _funcName = arguments.callee.name;
//
//     return mysqlUtil.querySingle(db_connection
//         , 'call proc_select_user_email_check'
//         , [
//             req.headers['user_uid'],
//             req.paramBody['email'],
//         ]
//     );
// }
//
// function queryUpdate(req, db_connection) {
//     const _funcName = arguments.callee.name;
//
//     return mysqlUtil.querySingle(db_connection
//         , 'call proc_update_user_access_token'
//         , [
//             req.innerBody['item']['uid'],
//             req.innerBody['item']['access_token'],
//         ]
//     );
// }
//
// function queryUpdateImage(req, db_connection) {
//     const _funcName = arguments.callee.name;
//
//     return mysqlUtil.querySingle(db_connection
//         , 'call proc_create_image'
//         , [
//             req.innerBody['item']['uid'],
//             req.innerBody['item']['uid'],
//             1,  // type===1 : 유저 프로필 이미지
//             req.paramBody['filename'],
//         ]
//     );
// }
//
