/**
 *
 * @swagger
 * /api/public/v2/user/info/review:
 *   get:
 *     summary: 자 or 타 유저 리뷰 리스트
 *     tags: [User]
 *     description: |
 *       path : /api/public/v2/user/info/review
 *
 *       * 자 or 타 유저 리뷰 리스트
 *       * limit 20개씩 이므로 offset 20개씩 증가
 *
 *     parameters:
 *       - in: query
 *         name: user_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: integer
 *           example: 212
 *         description: 유저 uid
 * 
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: integer
 *           example: 0
 *         description: 유저 uid
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const paramUtil = require('../../../../../common/utils/paramUtil');
const fileUtil = require('../../../../../common/utils/fileUtil');
const mysqlUtil = require('../../../../../common/utils/mysqlUtil');
const sendUtil = require('../../../../../common/utils/sendUtil');
const errUtil = require('../../../../../common/utils/errUtil');
const logUtil = require('../../../../../common/utils/logUtil');

const errCode = require('../../../../../common/define/errCode');

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

            
            const feedList = await querySelect(req, db_connection);
            req.innerBody['item'] = feedListParse(feedList);

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
    paramUtil.checkParam_noReturn(req.paramBody, 'user_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'offset');
}

function deleteBody(req) {

}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_user_info_review_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['user_uid'],
            req.paramBody['offset'],
        ]
    );
}

function feedListParse(feedList) {
    return feedList.map(item=>{
        const result = {
            ...item
        }
        if(item.multiple_product == 1){
            result['product_info'] = item.product_info.split('@!@').map(el => JSON.parse(el))
        }
        else{
            result['product_info'] = [JSON.parse(item.product_info)]
        }
        
        return result
    })
}