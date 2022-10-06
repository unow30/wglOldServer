/**
 * Created by hyunhunhwang on 2021. 01. 19.
 *
 * @swagger
 * /api/public/user/phone/check:
 *   get:
 *     summary: 사용 가능 전화번호 여부 체크
 *     tags: [User]
 *     description: |
 *       path : /api/public/user/phone/check
 *
 *       * 사용 가능 전화번호 여부 체크
 *       * 소셜 로그인당 하나의 전화번호만 가입 가능
 *         : ex) 카카오 로그인시 해당 전화번호로 가입된 카카오 계정이 있다면 가입불가
 *
 *     parameters:
 *       - in: query
 *         name: phone
 *         required: true
 *         schema:
 *           type: string
 *           example: '01012341234'
 *         description: 가입할 전화번호
 *       - in: query
 *         name: signup_type
 *         required: true
 *         schema:
 *           type: string
 *           example: 'kakao'
 *         description: |
 *           회원가입 타입
 *           * kakao: 카카오
 *           * naver: 네이버
 *           * apple: 애플
 *           * google: 구글
 *         enum: [kakao,naver,apple,google]
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */
const crypto = require("crypto");

const paramUtil = require('../../../common/utils/paramUtil');
const fileUtil = require('../../../common/utils/fileUtil');
const mysqlUtil = require('../../../common/utils/mysqlUtil');
const sendUtil = require('../../../common/utils/sendUtil');
const errUtil = require('../../../common/utils/errUtil');
const logUtil = require('../../../common/utils/logUtil');
const errCode = require('../../../common/define/errCode');
const aligoUtil = require('../../../common/utils/aligoUtil');





let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            //하나의 소셜계정에 하나의 번호 저장 가능
            //해당 전화번호를 가지고있는 미탈퇴 유저정보 중에서 signup_type과 phone이 일치하면 회원가입 불가
            let phone = await queryCheckPhone(req, db_connection);
            console.log(phone)
            if( phone ){
                errUtil.createCall(errCode.already, `소셜 로그인별로 하나의 연락처만 가입할 수 있습니다.`)
                return
            }

            let certificationNumber = ''
            for(let i=0; i<6; i++ ){
                certificationNumber += Math.floor(Math.random() * 10)
            }

            const messageResult = await smsService(req, certificationNumber)
            console.log(messageResult)

            req.innerBody['success'] = 1
            req.innerBody['certificationNumber'] = certificationNumber

            deleteBody(req)
            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });

    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function checkParam(req) {
    paramUtil.checkParam_noReturn(req.paramBody, 'phone');
    // paramUtil.checkParam_noReturn(req.paramBody, 'social_id');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function queryCheckPhone(req, db_connection){
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_user_phone_check'
        , [
            req.headers['user_uid'],
            req.paramBody['phone'],
            req.paramBody['signup_type'],
        ]
    );
}

async function smsService(req, certificationNumber){
    req.body.sender = process.env.ALIGO_WEGGLE_NUMBER  // (최대 16bytes)
    req.body.receiver = req.paramBody['phone'] // 컴마()분기 입력으로 최대 1천명
    req.body.msg = `위글 휴대폰 인증번호 [ ${certificationNumber} ]`	// (1~2,000Byte)
    req.body.msg_type = 'SMS'
    
    return await aligoUtil.smsSend(req);
}