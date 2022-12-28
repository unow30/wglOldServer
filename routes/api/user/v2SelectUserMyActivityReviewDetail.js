/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/user/my/activity/review/detail:
 *   get:
 *     summary: 내활동 리뷰 디테일
 *     tags: [User]
 *     description: |
 *      ## path : /api/private/v2/user/my/activity/review/detail
 *
 *       * 리뷰 디테일
 * 
 *     parameters:
 *       - in: query
 *         name: review_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           게시글 uid
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: |
 *           비디오리뷰: 1, 포토리뷰: 2
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
const dateUtil = require('../../../common/utils/dateUtil')


let file_name = fileUtil.name(__filename);
module.exports = function (req, res) {
    const _funcName = arguments.callee.name;
    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);

        mysqlUtil.connectPool(async function (db_connection) {
        req.innerBody = {};

        const reviewDetail = await queryReview(req, db_connection);
        if(reviewDetail){
            req.innerBody['item'] = feedListParse(reviewDetail)
        }else{
            req.innerBody['item'] = {}
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

async function queryReview(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_my_activity_review_detail_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['post_uid'],
            req.paramBody['type'],
        ]
    );
}

function feedListParse(review) {
        if(review.multiple_product == 1){
            review['product_info'] = review.product_info.split('@!@').map(el => JSON.parse(el))
        }
        else if(review.multiple_product == 0){
            review['product_info'] = [JSON.parse(review.product_info)]
        }
        
        return review
}