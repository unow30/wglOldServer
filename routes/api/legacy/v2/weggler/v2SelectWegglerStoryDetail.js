/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/weggler/story/detail:
 *   get:
 *     summary: 위글러 스토리 디테일 리스트 페이지
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/story/detail
 *
 *       * 위글러 스토리 디테일 리스트 페이지
 * 
 *     parameters:
 *       - in: query
 *         name: target_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 212
 *         description: |
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

let file_name = fileUtil.name(__filename);
module.exports = function (req, res) {
    const _funcName = arguments.callee.name;
    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);
        
        mysqlUtil.connectPool(async function (db_connection) {
        req.innerBody = {};

        const feedList = await querySelect(req, db_connection);
        const parseItem = feedListParse(feedList)
        req.innerBody['item'] = parseItem.result
        req.innerBody['index'] = parseItem.index
 
        sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });
    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

async function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    // return mysqlUtil.querySingle(db_connection
    return mysqlUtil.queryArray(db_connection
        , 'call proc_weggler_story_detail_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['target_uid'],
        ]
    );
}

function feedListParse(feedList) {
    let visitObject = {}
    const mapData = feedList.map((item, index)=>{
        const result = {
            ...item
        }
        if(item.multiple_product == 1){
            result['product_info'] = item.product_info.split('@!@').map(el => JSON.parse(el))
        }
        else{
            result['product_info'] = [JSON.parse(item.product_info)]
        }

        if(visitObject.index === undefined && item.visit == 0){
            visitObject.index = index
        }
        
        return result
    })

    return {result: mapData, index: visitObject.index ?? 0}
}