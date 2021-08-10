/**
 * Created by gunucklee on 2021. 08. 09.
 *
 * @swagger
 * /api/private/reward/accountBook:
 *   post:
 *     summary: 리워드 계좌 등록
 *     tags: [Reward]
 *     description: |
 *       path : /api/private/reward/accountBook
 *
 *       * 리워드 계좌 등록
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           리워드 계좌 등록
 *         schema:
 *           type: object
 *           required:
 *             - bank_user
 *             - bank_account
 *             - bank_code
 *             - filename_idcard
 *             - filename_bankbook
 *           properties:
 *             bank_user:
 *               type: string
 *               example: 홍길동
 *               description: 예금주
 *             bank_account:
 *               type: string
 *               example: 000-0000-00000
 *               description: 계좌번호
 *             bank_code:
 *               type: number
 *               example: 1
 *               description: |
 *                 은행 코드
 *                 * 002 : 산업은행
 *                 * 003 : 기업은행
 *                 * 004 : 국민은행
 *                 * 007 : 수협은행
 *                 * 011 : 농협은행
 *                 * 020 : 우리은행
 *                 * 023 : SC제일은행
 *                 * 027 : 한국씨티은행
 *                 * 031 : 대구은행
 *                 * 032 : 부산은행
 *                 * 034 : 광주은행
 *                 * 035 : 제주은행
 *                 * 037 : 전북은행
 *                 * 039 : 경남은행
 *                 * 045 : 새마을금고
 *                 * 048 : 신협중앙회
 *                 * 050 : 저축은행
 *                 * 054 : HSBC은행
 *                 * 055 : 도이치은행
 *                 * 057 : JP모간체이스은행
 *                 * 060 : 뱅크오브아메리카
 *                 * 061 : BNP파리바은행
 *                 * 062 : 중국공상은행
 *                 * 063 : 중국은행
 *                 * 064 : 산림조합중앙회
 *                 * 067 : 중국건설은행
 *                 * 071 : 우체국
 *                 * 081 : 하나은행
 *                 * 088 : 신한은행
 *                 * 089 : 케이뱅크
 *                 * 090 : 카카오뱅크
 *                 * 209 : 유안타증권
 *                 * 218 : KB증권
 *                 * 224 : BNK투자증권
 *                 * 225 : IBK투자증권
 *                 * 227 : KTB투자증권
 *                 * 238 : 미래에셋대우
 *                 * 240 : 삼성증권
 *                 * 243 : 한국투자증권
 *                 * 247 : NH투자증권
 *                 * 261 : 교보증권
 *                 * 262 : 하이투자증권
 *                 * 263 : 현대차증권
 *                 * 264 : 키움증권
 *                 * 265 : 이베스트투자증권
 *                 * 266 : 에스케이증권
 *                 * 267 : 대신증권
 *                 * 269 : 한화투자증권
 *                 * 270 : 하나금융투자
 *                 * 278 : 신한금융투자
 *                 * 279 : DB금융투자
 *                 * 280 : 유진투자증권
 *                 * 287 : 메리츠증권
 *                 * 288 : 카카오페이증권
 *                 * 290 : 부국증권
 *                 * 291 : 신영증권
 *                 * 292 : 케이프투자증권
 *                 * 294 : 한국포스증권
 *               enum: [002,003,004,007,011,020,023,027,031,032,034,035,037,039,045,048,050,054,055,057,060,061,062,063,064,067,071,081,088,089,090,209,218,224,225,227,238,240,243,247,261,262,263,264,265,266,267,269,270,278,279,280,287,288,290,291,292,294]
 *             filename_idcard:
 *               type: string
 *               example: idcard_img.png
 *               description: |
 *                 신분증 사본 파일 이미지
 *                 * 이미지 업로드 : http://35.78.124.248:3456/api-docs/#/File/post_api_public_file
 *             filename_bankbook:
 *               type: string
 *               example: bankbook_img.png
 *               description: |
 *                 통장 사본 파일 이미지
 *                 * 이미지 업로드 : http://35.78.124.248:3456/api-docs/#/File/post_api_public_file
 *
 *
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/QnA'
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
    paramUtil.checkParam_noReturn(req.paramBody, 'amount');
    paramUtil.checkParam_noReturn(req.paramBody, 'bank_code');
    paramUtil.checkParam_noReturn(req.paramBody, 'bank_user');
    paramUtil.checkParam_noReturn(req.paramBody, 'bank_account');
    paramUtil.checkParam_noReturn(req.paramBody, 'filename_idcard');
    paramUtil.checkParam_noReturn(req.paramBody, 'filename_bankbook');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_reward_account_book'
        , [
            req.headers['user_uid'],
            req.paramBody['bank_code'],
            req.paramBody['bank_user'],
            req.paramBody['bank_account'],
            req.paramBody['filename_idcard'],
            req.paramBody['filename_bankbook'],
        ]
    );
}

