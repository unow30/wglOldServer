/**
 * Created by hyunhunhwang on 2020. 12. 29.
 *
 * @swagger
 * /api/public/user/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [User]
 *     description: |
 *       path : /api/public/user/signup
 *
 *       * 회원가입
 *       * 해당 api 호출 전 필수 사항
 *         : 회원가입 여부 체크 필요 => /api/public/user/signup/check
 *         : 이미지 업로드 => /api/public/file
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           회원가입
 *         schema:
 *           type: object
 *           required:
 *             - signup_type
 *             - social_id
 *             - email
 *             - push_token
 *             - os
 *             - version_app
 *           properties:
 *             signup_type:
 *               type: string
 *               example: 'kakao'
 *               description: |
 *                 회원가입 타입
 *                 * kakao: 카카오
 *                 * naver: 네이버
 *                 * apple: 애플
 *               enum: [kakao,naver,apple]
 *             social_id:
 *               type: string
 *               example: 'kakao_a1234567890'
 *               description: 소셜 id
 *             email:
 *               type: string
 *               example: 'kakao@email.com'
 *               description: 이메일
 *             nickname:
 *               type: string
 *               example: 'nickna12'
 *               description: 닉네임
 *             phone:
 *               type: integer
 *               example: 01012341234
 *               description: 연락처
 *             about:
 *               type: string
 *               example: '한줄소개입니다.'
 *               description: 한줄소개
 *             interests:
 *               type: integer
 *               example: 69
 *               description: |
 *                 관심사(카테고리) - 비트연산
 *                 ex) (1:식품)+(4:홈데코)+(64:스포츠레저) = 69
 *                 * 1: 식품
 *                 * 2: 뷰티
 *                 * 4: 홈데코
 *                 * 8: 패션잡화
 *                 * 16: 반려동물
 *                 * 32: 유아
 *                 * 64: 스포츠레저
 *                 * 128: 식물
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
 *               example: male
 *               description: |
 *                 성별
 *                 * male: 남성
 *                 * female: 여성
 *               enum: [male,female]
 *             filename:
 *               type: string
 *               example: abcdefg.png
 *               description: |
 *                 프로필 파일명
 *                 * /api/public/file api 호출뒤 응답값인 filename 를 사용
 *             push_token:
 *               type: string
 *               example: 'asdfasdfasdfasdfasdfasdfadfsa'
 *               description: fcm 푸시 token
 *             os:
 *               type: string
 *               example: 'android'
 *               description: |
 *                 디바이스 운영체제
 *               enum: [android, ios]
 *             version_app:
 *               type: string
 *               example: '0.0.1'
 *               description: |
 *                 위글 앱 버전
 *                 * ex - 0.0.1
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

const paramUtil = require('../../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../../common/utils/legacy/origin/logUtil');
const jwtUtil = require('../../../../../common/utils/legacy/origin/jwtUtil');
const fcmUtil = require('../../../../../common/utils/legacy/origin/fcmUtil')

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

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await queryCheck(req, db_connection);
            if( req.innerBody['item'] ){
                errUtil.createCall(errCode.already, `이미 회원가입한 유저입니다.`)
                return
            }

            let email_data = await queryCheckEmail(req, db_connection);
            if( email_data ){
                errUtil.createCall(errCode.already, `이미 가입한 이메일 입니다.`)
                return
            }
            let nickname_count_data = await queryCheckNickname(req, db_connection);
            if( nickname_count_data['count'] > 0 ){
                errUtil.createCall(errCode.already, `이미 사용중인 닉네임 입니다.`)
                return
            }


            // 추천인 코드 생성기
            req.paramBody['recommender_code'] = recommenderCode();
            let recommender_code_data = await queryCheckRecommenderCode(req, db_connection);

            while(recommender_code_data) {
                req.paramBody['recommender_code'] = recommenderCode();
                recommender_code_data = await queryCheckRecommenderCode(req, db_connection);
            }

            req.innerBody['item'] = await query(req, db_connection);

            req.innerBody['item']['access_token'] = jwtUtil.createToken(req.innerBody['item'], '100d');
            await queryUpdate(req, db_connection);

            req.paramBody['filename']  =  (req.paramBody['filename'] && req.paramBody['filename'].length >= 4) ?
                                           req.paramBody['filename'] : "profile_default_image.png"
            await queryUpdateImage(req, db_connection);


            // 추천인 이벤트 포인트 지급
            // 추천인: 3000
            // 피추천인: 2000
            // 이미 앱단에서 추천인 코드 유효성을 검사해주기 때문에 바로 포인트 지급을 해준다.
            if(req.paramBody['recommendee_code']) {
                let deleted_user_email = await queryCheckDeletedEmail(req, db_connection);
                if(!deleted_user_email) {
                    let point = await queryRecommendPointEvent(req, db_connection);
                    console.log("recommendPointEven2t: " + JSON.stringify(point));
                    let item = {};
                    item['user_uid'] = req.innerBody['item']['uid'];
                    item['push_token_list'] = [];
                    item['push_token_list'].push(point['fcm_push_token_me']);
                    item['push_token_list'].push(point['fcm_push_token_other']);

                    let recommendPointEvent = await fcmUtil.fcmPointRecommendCodeList(item);
                    recommendPointEvent['data']['user_uid'] = item['user_uid'];
                    console.log("recommendPointEvent131: " + JSON.stringify(recommendPointEvent['data']));

                    await queryInsertFCM(recommendPointEvent['data'], db_connection);
                    recommendPointEvent['data']['user_uid'] = point['fcm_user_uid_other'];
                    await queryInsertFCM(recommendPointEvent['data'], db_connection);
                }
            }

            // 230718 그린피 sdk추가로 포인트 제공 사라짐
            // 회원가입한 이메일과 동일한 이메일을 가진 탈퇴유저가 있다면 포인트 3000을 줘선 안된다.
            // 포인트를 쓴 계정을 회원탈퇴하고 재가입하면 포인트 3000을 줘선 안된다. 포인트를 안쓰고 탈회한 유저도 재가입하면 포인트를 줘선 안된다.
            // let deleted_user_email = await queryCheckDeletedEmail(req, db_connection);
            // if(!deleted_user_email){
            //     let point = await queryPointEvent(req, db_connection); //포인트 3000점 이벤트
            //     let item = {}
            //         item['push_token'] = req.paramBody['push_token']
            //         item['user_uid'] = req.innerBody['item']['uid']
            //         item['point_uid'] = point['point_uid']
            //     let fcmPoint3000 = await fcmUtil.fcmEventPoint3000Single(item);
            //     await queryInsertFCM(fcmPoint3000['data'], db_connection)
            // }


            deleteBody(req);
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
    paramUtil.checkParam_noReturn(req.paramBody, 'signup_type');
    paramUtil.checkParam_noReturn(req.paramBody, 'social_id');
    paramUtil.checkParam_noReturn(req.paramBody, 'email');
    paramUtil.checkParam_noReturn(req.paramBody, 'nickname');
    paramUtil.checkParam_noReturn(req.paramBody, 'about');
    paramUtil.checkParam_noReturn(req.paramBody, 'interests');
    paramUtil.checkParam_noReturn(req.paramBody, 'age');
    paramUtil.checkParam_noReturn(req.paramBody, 'gender');
    paramUtil.checkParam_noReturn(req.paramBody, 'push_token');
    paramUtil.checkParam_noReturn(req.paramBody, 'os');
    paramUtil.checkParam_noReturn(req.paramBody, 'version_app');
}

function deleteBody(req) {
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    //let user_uid = req.headers['user_uid'] ? req.headers['user_uid'] : 0;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_user'
        , [
            req.paramBody['signup_type'],
            req.paramBody['social_id'],
            req.paramBody['email'],
            req.paramBody['nickname'],
            req.paramBody['phone'],
            req.paramBody['about'],
            req.paramBody['interests'],
            req.paramBody['gender'],
            req.paramBody['age'],
            req.paramBody['push_token'],
            req.paramBody['os'],
            req.paramBody['version_app'],
            req.paramBody['recommender_code'],
            req.paramBody['recommendee_code'],
        ]
    );
}

function queryCheck(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_user_signup_check'
        , [
            req.paramBody['signup_type'],
            req.paramBody['social_id'],
        ]
    );
}

function queryCheckNickname(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_user_nickname_check'
        , [
            0,
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
        ]
    );
}


function queryUpdate(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_user_access_token'
        , [
            req.innerBody['item']['uid'],
            req.innerBody['item']['access_token'],
        ]
    );
}

function queryUpdateImage(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_image'
        , [
            req.innerBody['item']['uid'],
            req.innerBody['item']['uid'],
            1,  // type===1 : 유저 프로필 이미지
            req.paramBody['filename'],
        ]
    );
}

function queryRecommendPointEvent(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_recommendee_point_event'
        , [
            req.innerBody['item']['uid'],
            req.paramBody['recommendee_code'],
        ]
    );
}

// function queryPointEvent(req, db_connection) {
//     const _funcName = arguments.callee.name;
//
//     //let user_uid = req.headers['user_uid'] ? req.headers['user_uid'] : 0;
//
//     return mysqlUtil.querySingle(db_connection
//         , 'call _dev_event_create_point_3000_for_signup'
//         , [
//             req.innerBody['item']['uid'],
//         ]
//     );
// }


function queryInsertFCM(data, db_connection){

    return mysqlUtil.querySingle(db_connection
        ,'call proc_create_fcm_data'
        , [
            data['user_uid'],
            data['alarm_type'],
            data['title'],
            data['message'],
            data['video_uid'] == null? 0 : data['video_uid'],
            data['target_uid'] == null? 0 : data['target_uid'],
            'point.png'
        ]
    );
}

function queryCheckDeletedEmail(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_user_deleted_email_check'
        , [
            req.headers['user_uid'],
            req.paramBody['email'],
        ]
    );
}



function queryCheckRecommenderCode(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_recommender_code_check'
        , [
            req.paramBody['recommender_code']
        ]
    );
}


function recommenderCode(){
    let code = "";
    let cases = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    for( let i=0; i < 6; i++ )
        code += cases.charAt(Math.floor(Math.random() * cases.length));
    return code;
}
