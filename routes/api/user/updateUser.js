/**
 * Created by hyunhunhwang on 2021. 01. 02.
 *
 * @swagger
 * /api/private/user:
 *   put:
 *     summary: 유저 정보 수정
 *     tags: [User]
 *     description: |
 *       path : /api/private/user
 *
 *       * 유저 정보 수정
 *       * 해당 api 호출 전 필수 사항
 *         : 이미지 업로드 => /api/public/file
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           유저 정보 수정
 *         schema:
 *           type: object
 *           required:
 *             - nickname
 *             - about
 *             - interests
 *             - age
 *             - gender
 *             - email
 *           properties:
 *             email:
 *               type: string
 *               example: abcd@email.com
 *               description: 이메일
 *             nickname:
 *               type: string
 *               example: nickch
 *               description: 닉네임
 *             about:
 *               type: string
 *               example: 한줄소개 수정합니다.
 *               description: 한줄소개
 *             interests:
 *               type: integer
 *               example: 69
 *               description: |
 *                 관심사(카테고리) - 비트연산
 *                 ex) (1:수제먹거리)+(4:인테리어 소품)+(64:가죽 공예) = 69
 *                 * 1: 수제 먹거리
 *                 * 2: 음료
 *                 * 4: 인테리어 소품
 *                 * 8: 악세사리
 *                 * 16: 휴대폰 주변기기
 *                 * 32: 비누/캔들
 *                 * 64: 가죽 공예
 *                 * 128: 꽃
 *                 * 256: 반려견
 *             age:
 *               type: integer
 *               example: 30
 *               description: |
 *                 나이대역
 *                 * 20: 20대 이하
 *                 * 30: 30대
 *                 * 40: 40대
 *                 * 50: 50대 이상
 *               enum: [20,30,40,50]
 *             gender:
 *               type: string
 *               example: female
 *               description: |
 *                 성별
 *                 * male: 남성
 *                 * female: 여성
 *               enum: [male,female]
 *             filename:
 *               type: string
 *               example: abcdabcdabcd.png
 *               description: |
 *                 프로필 파일명
 *                 * /api/public/file api 호출뒤 응답값인 filename 를 사용
 *
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/User'
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

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);
        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            let nickname_count_data = await queryCheckNickname(req, db_connection);
            if( nickname_count_data['count'] > 0 ){
                errUtil.createCall(errCode.already, `이미 사용중인 닉네임 입니다.`)
                return
            }

            if( req.paramBody['email'] ) {
                let email_data = await queryCheckEmail(req, db_connection);
                if( email_data ){
                    errUtil.createCall(errCode.already, `사용 불가능한 이메일 입니다.`)
                    return
                }
            }

            if( req.paramBody['filename'] && req.paramBody['filename'].length >= 4 ){
                await queryUpdateImage(req, db_connection);
            }

            req.innerBody['item'] = await query(req, db_connection);

            deleteBody(req)
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

function checkParam(req) {
    paramUtil.checkParam_noReturn(req.paramBody, 'nickname');
    paramUtil.checkParam_noReturn(req.paramBody, 'about');
    paramUtil.checkParam_noReturn(req.paramBody, 'interests');
    paramUtil.checkParam_noReturn(req.paramBody, 'age');
    paramUtil.checkParam_noReturn(req.paramBody, 'gender');
    paramUtil.checkParam_noReturn(req.paramBody, 'email');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    delete req.innerBody['item']['push_token']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_user_info'
        , [
            req.headers['user_uid'],
            req.paramBody['email'],
            req.paramBody['nickname'],
            req.paramBody['about'],
            req.paramBody['interests'],
            req.paramBody['gender'],
            req.paramBody['age'],
        ]
    );
}

function queryCheckNickname(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_user_nickname_check'
        , [
            req.headers['user_uid'],
            req.paramBody['nickname'],
        ]
    );
}

function queryCheckEmail(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_user_email_check'
        , [
            req.headers['user_uid'],
            req.paramBody['email'],
            // req.headers['access_token'],
        ]
    );
}

function queryUpdateImage(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_image'
        , [
            req.headers['user_uid'],
            req.headers['user_uid'],
            1,  // type===1 : 유저 프로필 이미지
            req.paramBody['filename'],
        ]
    );
}


