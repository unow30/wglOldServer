/**
 *
 * @swagger
 * /api/private/v3/user:
 *   put:
 *     summary: 유저 정보 수정
 *     tags: [User]
 *     description: |
 *       ## path : /api/private/v2/user
 *
 *       * ## 유저 정보 수정
 *       * ## 해당 api 호출 전 필수 사항
 *         ### : 이미지 업로드 => /api/public/file 호출 후 업로드된 이미지 파일명 전달
 *         ### => 이미지 업로드 없이 filename을 profile_default_image.png로 주면 기본 이미지로 변경된다.
 *         ### filename_bg를 전달하지 않으면 null로 서버에서 초기화한다.
 *         ### filename, filename_bg이 기존 이름과 다르면 업데이트된다.
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
 *             - insta_url
 *             - naver_blog_url
 *             - youtube_url
 *           properties:
 *             nickname:
 *               type: string
 *               example: nickch
 *               description: 닉네임
 *             about:
 *               type: string
 *               example: 한줄소개 수정합니다.
 *               description: 한줄소개
 *             interests:
 *               type: array
 *               items:
 *                 type: number
 *               example: [1, 4, 6]
 *             filename:
 *               type: string
 *               example: abcdabcdabcd.png
 *               description: |
 *                 프로필 파일명
 *                 * /api/public/file api 호출뒤 응답값인 filename 를 사용
 *             filename_bg:
 *               type: string
 *               example: abcdabcdabcd.png
 *               description: |
 *                 프로필 파일명
 *                 * /api/public/file api 호출뒤 응답값인 filename 를 사용
 *             insta_url:
 *               type: string
 *               example: https://www.instagram.com/abcdefg
 *               description: |
 *                 인스타그램 주소
 *             naver_blog_url:
 *               type: string
 *               example: https://blog.naver.com/aabbccdd
 *               description: |
 *                 네이버블로그 주소
 *             youtube_url:
 *               type: string
 *               example: https://www.youtube.com/aabbccdd
 *               description: |
 *                 유튜브 주소
 *
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

const paramUtil = require('../../../../common/utils/paramUtil');
const fileUtil = require('../../../../common/utils/fileUtil');
const mysqlUtil = require('../../../../common/utils/mysqlUtil');
const sendUtil = require('../../../../common/utils/sendUtil');
const errUtil = require('../../../../common/utils/errUtil');
const logUtil = require('../../../../common/utils/logUtil');
const jwtUtil = require('../../../../common/utils/jwtUtil');

const errCode = require('../../../../common/define/errCode');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}\n`);
        req.paramBody = paramUtil.parse(req);
        logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}\n`);

        checkParam(req);
        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};

            let nickname_count_data = await queryCheckNickname(req, db_connection);
            if( nickname_count_data['count'] > 0 ){
                errUtil.createCall(errCode.already, `이미 사용중인 닉네임 입니다.`)
                return
            }

            //과거
            //기본 이미지로 돌아가지 않는다.
            //바뀐 이미지가 없으면 null로 날라온다. 그때는 건너뛴다.
            // if( req.paramBody['filename'] !== null && req.paramBody['filename'].length >= 4 ){
            //     await queryUpdateImage(req, db_connection);
            // }

            //내 유저정보 불러오기
            let myInfo = await querySelectUserInfo(req, db_connection);

            //프로필 이미지가 내 이미지와 다른 이름이면 변경.
            if(req.paramBody['filename'] !== null && req.paramBody['filename'] !== myInfo['filename']){
                console.log('프로필이미지 변경')
                await queryUpdateImage(req, db_connection);
            }

            //과거
            //바뀐 이미지가 없으면 null로 날라온다. 그때는 건너뛴다.
            // if( req.paramBody['filename_bg'] !== null && req.paramBody['filename_bg'].length >= 4){
            //     await queryUpdateBackGround(req, db_connection);
            // }

            //req.paramBody['filename_bg'] === null이면 사진을 지운다.
            //배경 이미지가 null이라면 bg이미지 삭제처리 없으면 어차피 아무일도 안일어나
            //배경 이미지가 내 배경 이미지와 다른 이름이면 변경
            if(req.paramBody['filename_bg'] === null){
                console.log('백그라운드 이미지 삭제')
                await queryDeleteBackGround(req, db_connection, myInfo)
            }else if(req.paramBody['filename_bg'] !== myInfo['filename_bg']){
                console.log('백그라운드 이미지 변경')
                await queryUpdateBackGround(req, db_connection, myInfo);
            }

            if(req.paramBody.interests){
                await queryDeleteInterest(req, db_connection);

                if(req.paramBody.interests[0] ){
                    const interestsData = await querySelectAllInterest(req, db_connection);

                    req.paramBody.interests.forEach(el => {
                        if(el < interestsData[0].interests_uid || el > interestsData[interestsData.length-1].interests_uid){
                            const err = new Error('전달 받은 파라미터의 uid가 최대 및 최소 uid 값을 벗어났습니다.')
                            err.code = 400;

                            sendUtil.sendErrorPacket(req, res, err);
                        }
                    });

                    await queryUpdateInterest(req, db_connection);
                }
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
    //insta_url, naver_blog_url, youtube_url이 빈 문자열 또는 null로 들어올 것이다.
    //빈 문자열이면 null로 저장해야 한다.
    //url도매인 필터링은 프론트에서 해준다.
    // if(typeof req.paramBody['insta_url'] !== 'string' && req.paramBody['insta_url'].trim().length === 0){

    if(!req.paramBody['insta_url']){
        req.paramBody['insta_url'] = null
    }

    // if(typeof req.paramBody['naver_blog_url'] !== 'string' && req.paramBody['naver_blog_url'].trim().length === 0){
    if(!req.paramBody['naver_blog_url']){
        req.paramBody['naver_blog_url'] = null
    }
    // if(typeof req.paramBody['youtube_url'] !== 'string' && req.paramBody['youtube_url'].trim().length === 0){
    if(!req.paramBody['youtube_url']){
        req.paramBody['youtube_url'] = null
    }
    // if(typeof req.paramBody['filename_bg'] !== 'string' && req.paramBody['filename_bg'].trim().length === 0){
    if(!req.paramBody['filename_bg']){
        req.paramBody['filename_bg'] = null
    }

    if(!req.paramBody['filename']){
        req.paramBody['filename'] = null
    }

    paramUtil.checkParam_noReturn(req.paramBody, 'nickname');
    paramUtil.checkParam_noReturn(req.paramBody, 'about');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    delete req.innerBody['item']['push_token']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_user_info_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['nickname'],
            req.paramBody['about'],
            req.paramBody['insta_url']? req.paramBody['insta_url'] : null,
            req.paramBody['naver_blog_url']? req.paramBody['naver_blog_url'] : null,
            req.paramBody['youtube_url']? req.paramBody['youtube_url'] : null,
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


function queryUpdateImage(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_image'
        , [
            req.headers['user_uid'],
            req.headers['user_uid'],
            1,  // type===1 : 유저 프로필 이미지
            req.paramBody['filename']? req.paramBody['filename'] : 'profile_default_image.png', //filename null이면 기본이미지로 변경
        ]
    );
}

function queryUpdateBackGround(req, db_connection){
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_image'
        , [
            req.headers['user_uid'],
            req.headers['user_uid'],
            6,  // type===6 : 유저 프로필 배경 이미지
            req.paramBody['filename_bg'],
        ]
    );
}

async function queryUpdateInterest(req, db_connection) {

    console.log('interest insert 시작 ===========>')
    const interestData = req.paramBody['interests'].map(result => [req.headers['user_uid'], result]);
    const insertInterestSql = `
            insert into tbl_user_interests(user_uid, interest_uid)
            values ?;
    `
    await db_connection.query(insertInterestSql, [interestData]);
}

async function queryDeleteInterest(req, db_connection) {
    console.log('interest delete 시작 ===========>')
    const deleteInterestSql = `
            set SQL_SAFE_UPDATES = 0;

            delete from tbl_user_interests
            where user_uid = ${req.headers['user_uid']};

            set SQL_SAFE_UPDATES = 1;
    `
    await db_connection.query(deleteInterestSql);
}

function querySelectAllInterest(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_interest_keyword_v2'
        , [
        ]
    );
}

function querySelectUserInfo(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_user_info'
        , [
            req.headers['user_uid'],
            // req.headers['access_token'],
        ]
    );
}

async function queryDeleteImage(req, db_connection, myInfo){
    console.log('user profile update 시작 ===========>')
    const deleteProfileImage = `
            set SQL_SAFE_UPDATES = 0;

            update tbl_image
            set filename = "profile_default_image.png"
            where user_uid = ${req.headers['user_uid']}
            and target_uid = ${req.headers['user_uid']}
            and type = 1
            and filename = '${myInfo['filename']}'
            ;

            set SQL_SAFE_UPDATES = 1;
    `
    await db_connection.query(deleteProfileImage);

}

async function queryDeleteBackGround(req, db_connection, myInfo){
    console.log('user background delete 시작 ===========>')
    const deleteBackGroundImage =
        `set SQL_SAFE_UPDATES = 0;

        update tbl_image
        set is_deleted = 1
        where user_uid = ${req.headers['user_uid']}
        and target_uid = ${req.headers['user_uid']}
        and is_deleted = 0
        and type = 6
        and filename = '${myInfo['filename_bg']}'
        ;

        set SQL_SAFE_UPDATES = 1;
    `
    console.log(myInfo['filename_bg'])
    await db_connection.query(deleteBackGroundImage);
}