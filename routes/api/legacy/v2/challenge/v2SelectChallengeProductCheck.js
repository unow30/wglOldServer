/**
 * Created by jongho
 *
 * 
 * @swagger
 * /api/private/v2/challenge/product/check:
 *   get:
 *     summary: 챌린지 리뷰 생성 전 진행 여부 및 상품 정보
 *     tags: [Challenge]
 *     description: |
 *       path : /api/private/v2/challenge/product/check
 *
 *       * 챌린지 리뷰 생성 전 진행 여부 및 상품 정보
 *
 *
 *     responses:
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

            const productInfo = await querySelect(req, db_connection);
            if(productInfo){
                req.innerBody['is_active'] = 1
                req.innerBody['product_info'] = productInfo
            }
            else{
                req.innerBody['is_active'] = 0
                req.innerBody['product_info'] = {}
            }

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

}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_challenge_product_check_v2'
        , [
        ]
    );
}