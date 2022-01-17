/**
 * Created by yunhokim on 2022. 01. 04.
 *
 * @swagger
     * /api/public/user/auto/recommend:
 *   get:
 *     summary: asfakfjdo
 *     tags: [User]
 *     description: |
 *       path : adfaoijf
 *
 *       * adlfkndfopia
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/UserInfoMeFCMApi'
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

            let userList = await queryUser(req,db_connection);
            console.log("userList: " + JSON.stringify(userList));
            for(let i in userList ) {

                req.paramBody['recommender_code'] = recommenderCode();
                let recommender_code_data = await queryCheckRecommenderCode(req, db_connection);

                while(recommender_code_data) {
                    req.paramBody['recommender_code'] = recommenderCode();
                    recommender_code_data = await queryCheckRecommenderCode(req, db_connection);
                }
                req.paramBody['uid'] = userList[i]['uid']
                await queryUpdate(req, db_connection);
            }

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
    // paramUtil.checkParam_noReturn(req.paramBody, 'signup_type');
    // paramUtil.checkParam_noReturn(req.paramBody, 'social_id');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function queryUser(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_user_uid'
        , [
        ]
    );
}

function queryUpdate(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_update_recommender_auto'
        , [
            req.paramBody['uid'],
            req.paramBody['recommender_code'],
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