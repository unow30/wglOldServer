/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/weggler/recommend/review/list:
 *   get:
 *     summary: 추천 영상 불러오기
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/recommend/review/list:
 *
 *       * ## 추천영상 불러오기
 *       * ## 전체 10개 랜덤으로 불러온다.
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
        req.paramBody['random_seed'] = `${Math.floor(Math.random() * 10)}`

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};
            const result = await query(req, db_connection)
            req.innerBody['item'] = result.map(el =>{
                const productInfo = el.product_info.split('@!@').map(item => JSON.parse(item))
                er.product_info = productInfo

                return el
            })

            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });
    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}


async function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
    , 'call proc_select_weggler_recommend_review_list_v2'
    ,   [
            req.headers['user_uid'],
            req.paramBody['random_seed']
        ]
    )
}