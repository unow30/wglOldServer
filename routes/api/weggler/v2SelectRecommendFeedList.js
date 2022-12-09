/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/weggler/recommend/feed/list:
 *   get:
 *     summary: 팔로우 안한 유저의 추천 피드목록 불러오기
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/recommend/feed/list
 *
 *       * 팔로우 안한 유저의 추천 피드목록 불러오기
 *       * limit 12 이므로 offset 12씩 증가
 * 
 *     parameters:
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           offset
 *       - in: query
 *         name: random_seed
 *         required: true
 *         schema:
 *           type: string
 *           example: asdasd
 *         description: |
 *           offset
 *
 *     responses:
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

let file_name = fileUtil.name(__filename);
module.exports = function (req, res) {
    const _funcName = arguments.callee.name;
    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);

        mysqlUtil.connectPool(async function (db_connection) {
        req.innerBody = {};

        req.innerBody['item'] = await queryRecommendFeedList(req, db_connection);
        req.innerBody['item'] = feedListParse(req.innerBody['item'])
        
        sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });
    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

async function queryRecommendFeedList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_weggler_recommend_feed_list_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['offset'],
            req.paramBody['random_seed'],
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