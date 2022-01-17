/**
 * Created by gunucklee on 2022. 01. 17.
 *
 * @swagger
 * /api/public/user/recommendee/code/check:
 *   get:
 *     summary: 피 추천인 코드 유효성 체크
 *     tags: [User]
 *     description: |
 *       path : /api/public/user/recommendee/code/check:
 *
 *       * 피 추천인 코드 유효성 체크
 *
 *     parameters:
 *       - in: query
 *         name: recommendee_code
 *         required: true
 *         schema:
 *           type: string
 *           example: "Y3NDF1"
 *         description: 피 추천인 코드
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/UserCheckApi'
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

            let recommendee_data = await querySelect(req, db_connection);
            if( recommendee_data['count'] === 0 ){
                errUtil.createCall(errCode.already, `유효하지 않은 추천인 코드입니다. 다시 확인해주세요.`)
                return
            }

            // req.innerBody['is_already'] = 0
            req.innerBody['success'] = '사용가능한 추천인 코드입니다.'

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
    paramUtil.checkParam_noReturn(req.paramBody, 'recommendee_code');
    // paramUtil.checkParam_noReturn(req.paramBody, 'social_id');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_user_recommendee_code_check'
        , [
            req.paramBody['recommendee_code'],
            // req.headers['access_token'],
        ]
    );
}



