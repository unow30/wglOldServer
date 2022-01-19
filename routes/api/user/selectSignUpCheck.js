/**
 * Created by hyunhunhwang on 2020. 12. 29.
 *
 * @swagger
 * /api/public/user/signup/check:
 *   get:
 *     summary: 로그인 / 유저 회원가입 여부 체크
 *     tags: [User]
 *     description: |
 *       path : /api/public/user/signup/check
 *
 *       * 회원가입 여부 체크
 *       * 해당 api는 로그인 역활도 수행함
 *       * 이미 회원가입된 유저의 경우 해당 api를 호출한뒤 응닶값인 access_token 값을 header에 업데이트해 주세요
 *
 *     parameters:
 *       - in: query
 *         name: signup_type
 *         default: kakao
 *         required: true
 *         schema:
 *           type: string
 *           example: kakao
 *         description: |
 *           회원가입 타입
 *           * kakao: 카카오
 *           * naver: 네이버
 *           * apple: 애플
 *         enum: [kakao, naver, apple]
 *       - in: query
 *         name: social_id
 *         default: kakao_1234567890
 *         required: true
 *         schema:
 *           type: string
 *           example: kakao_1234567890
 *         description: |
 *           소셜 id
 *       - in: query
 *         name: push_token
 *         default: pushtoken-1234567890
 *         required: true
 *         schema:
 *           type: string
 *           example: pushtoken-1234567890
 *         description: |
 *           fcm 푸시 token
 *       - in: query
 *         name: os
 *         default: android
 *         required: true
 *         schema:
 *           type: string
 *           example: android
 *         description: |
 *           디바이스 운영체제
 *         enum: [android, ios]
 *       - in: query
 *         name: version_app
 *         default: 0.0.0
 *         required: true
 *         schema:
 *           type: string
 *           example: 0.0.0
 *         description: |
 *           위글 앱 버전
 *           * ex - 0.0.1
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

const paramUtil = require('../../../common/utils/paramUtil');
const fileUtil = require('../../../common/utils/fileUtil');
const mysqlUtil = require('../../../common/utils/mysqlUtil');
const sendUtil = require('../../../common/utils/sendUtil');
const errUtil = require('../../../common/utils/errUtil');
const logUtil = require('../../../common/utils/logUtil');
const jwtUtil = require('../../../common/utils/jwtUtil');

const errCode = require('../../../common/define/errCode');

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

            req.innerBody['item'] = await querySelect(req, db_connection);
            if (!req.innerBody['item']) {
                errUtil.createCall(errCode.empty, `회원가입하지 않은 유저입니다.`)
                return
            }

            req.innerBody['item']['access_token'] = jwtUtil.createToken(req.innerBody['item'], '100d')
            req.innerBody['item'] = await queryUpdate(req, db_connection);

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
    paramUtil.checkParam_noReturn(req.paramBody, 'signup_type');
    paramUtil.checkParam_noReturn(req.paramBody, 'social_id');
    // paramUtil.checkParam_noReturn(req.paramBody, 'push_token');
    paramUtil.checkParam_noReturn(req.paramBody, 'os');
    paramUtil.checkParam_noReturn(req.paramBody, 'version_app');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_user_signup_check'
        , [
            req.paramBody['signup_type'],
            req.paramBody['social_id'],
        ]
    );
}

function queryUpdate(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_user_login'
        , [
            req.innerBody['item']['uid'],
            req.innerBody['item']['access_token'],

            req.paramBody['push_token'],
            req.paramBody['os'],
            req.paramBody['version_app'],
        ]
    );
}

