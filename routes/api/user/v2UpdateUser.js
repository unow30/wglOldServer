/**
 *
 * @swagger
 * /api/private/v2/user:
 *   put:
 *     summary: 유저 정보 수정
 *     tags: [User]
 *     description: |
 *       path : /api/private/v2/user
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


            if( req.paramBody['filename'] && req.paramBody['filename'].length >= 4 ){
                await queryUpdateImage(req, db_connection);
            }
            if(req.paramBody.interests){
                await queryDeleteInterest(req, db_connection);

                if(req.paramBody.interests[0] ){
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
            req.paramBody['filename'],
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