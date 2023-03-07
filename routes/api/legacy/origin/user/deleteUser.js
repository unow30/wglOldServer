/**
 * Created by gunucklee on 2021. 08. 05.
 *
 * @swagger
 * /api/private/user:
 *   delete:
 *     summary: 유저 탈퇴
 *     tags: [User]
 *     description: |
 *       path : /api/private/user
 *
 *       * 유저 탈퇴
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/UserApi'
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const paramUtil = require('../../../../../common/utils/paramUtil');
const fileUtil = require('../../../../../common/utils/fileUtil');
const mysqlUtil = require('../../../../../common/utils/mysqlUtil');
const sendUtil = require('../../../../../common/utils/sendUtil');
const errUtil = require('../../../../../common/utils/errUtil');
const logUtil = require('../../../../../common/utils/logUtil');
const jwtUtil = require('../../../../../common/utils/jwtUtil');

const qs = require('querystring')
const fs = require('fs')
const axios = require('axios')

const errCode = require('../../../../../common/define/errCode');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            //탈퇴시점에 애플 로그인 code값이 있다면 이걸로 리프레시 토큰 만들기
            // if(req.paramBody['code']) {
            if(req.paramBody['code']) {
                console.log('애플로그인 revoke 로직 실행')
                let unixTime = Unix_timestampConv()
                let privateKey = fs.readFileSync('./Apple_AuthKey.pem')
                let clientSecret = jwtUtil.createAppleClientSecret(unixTime, unixTime + 3600, privateKey)
                const instance = axios.create({
                    method: 'post',
                    timeout: 6000,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });

                //client_secret으로 로그인 인증 리프레시 토큰 생성
                let refreshToken = await GenerateAndValidateTokens(instance, clientSecret, req.paramBody['code'])
                //만든 리프레시 토큰으로 바로 애플 api 탈퇴 로직 실행
                let revokeResult = await revokeAppleRefreshKey(instance, clientSecret, refreshToken)
                req.innerBody['apple_revoke'] = revokeResult
            }
            //애플 탈퇴로직이 완료되면 쿼리로 탈퇴 진행
            //결과값으로 그냥 'ok'전달하기
            req.innerBody['item'] = await query(req, db_connection);

            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        } );

    }
    catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}


function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_delete_user'
        , [
            req.headers['user_uid'],
        ]
    );
}


function Unix_timestampConv()
{
    return Math.floor(new Date().getTime() / 1000);
}

async function GenerateAndValidateTokens(instance, clientSecret, code){
    // 1. Generate and validate tokens
    try{
        let res = await instance.post('https://appleid.apple.com/auth/token',qs.stringify({
            client_id: process.env.SUB,
            client_secret: clientSecret,
            code: code,
            grant_type: 'authorization_code'
        }))
        console.log(res.data['refresh_token'])
        return res.data['refresh_token']
    }catch (e) {
        console.log('https://appleid.apple.com/auth/token에서 에러 발생')
        console.log(e.response.data)
        return errUtil.createCall(errCode.auth, `애플 토큰 인증 에러`)
    }
}

async function revokeAppleRefreshKey(instance, clientSecret, refreshToken){
    // 2. Revoke tokens
   try{
       let res = await instance.post('https://appleid.apple.com/auth/revoke', qs.stringify({
           client_id: process.env.SUB,
           client_secret: clientSecret,
           token: refreshToken,
           token_type_hint: 'refresh_token'
       }))
       console.log(res.status)
       return 'ok'
   } catch (e) {
       console.log('https://appleid.apple.com/auth/revoke에서 에러 발생')
       console.log(e)
       return errUtil.createCall(errCode.withdrawal, `애플 토큰 탈퇴 에러`)

   }




}

// 이거 안써도 되겠는데?
// async function FetchApplesPublicKey(){
//     const instance = axios.create({
//         baseURL: 'https://appleid.apple.com/auth/keys',
//         method: 'get',
//         timeout: 2000,
//         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
//         // data: {
//         //     client_id: process.env.SUB,
//         //     client_secret: refreshToken,
//         //     code: code,
//         //     withCredentials: true,
//         // },
//     });
//     console.log(instance)
//     let res2 = await instance.get('https://appleid.apple.com/auth/keys')
//     console.log(res2.data)
// }