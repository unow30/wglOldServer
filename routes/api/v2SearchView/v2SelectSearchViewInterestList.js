/**
 * Created by yunhokim on 2022. 12. 06.
 *
 * @swagger
 * /api/public/v2/searchview/interest/list:
 *   get:
 *     summary: 취향저격 상품 더보기
 *     tags: [v2SearchView]
 *     description: |
 *      ## path : /api/public/v2/searchview/interest/list
 *
 *         * ## 취향저격 상품 더보기
 *         * ### 유저가 선택한 관심사와 일치하는 상품정보 표시
 *         * ### offset으로 패이징한다.
 *         * 비회원, 관심사 없으면 전체상품 중 랜덤으로 나온다.
 *
 *     parameters:
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           페이지네이션 숫자
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
            req.innerBody['item'] = await queryInterestsList(req, db_connection); // 지금뜨는 공구딜


            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });
    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function queryInterestsList(req, db_connection){
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_interests_product_list_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['random_seed'],
            req.paramBody['offset'],
        ]
    );
}