/**
 * Created by yunhokim on 2022.12.02
 *
 * @swagger
 * /api/public/v2/searchview/price/range/list:
 *   get:
 *     summary: 가격대별 상품목록 더보기
 *     tags: [v2SearchView]
 *     description: |
 *      ## path : /api/public/v2/searchview/price/range/list
 *
 *         * ## 가격대별 상품목록 더보기
 *         * ### n원 이상 m원 미만 상품목록을 불러온다.
 *         * ### 12개씩 불러오니 10개만 표시한다.
 *         * ### 홈뷰에서는 offset= 0, category=65535 고정이다.
 *         * ### 더보기 누를때만 offset, category를 변경할 수 있다.
 *
 *     parameters:
 *       - in: query
 *         name: category
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: |
 *           상품 카테고리
 *           * 1: 식품
 *           * 2: 뷰티, 주얼리
 *           * 4: 인테리어
 *           * 8: 패션,잡화
 *           * 16: 반려동물
 *           * 32: 생활용품
 *           * 65535: 전체상품
 *         enum: [65535,1,2,4,8,16,32]
 *       - in: query
 *         name: random_seed
 *         required: true
 *         schema:
 *           type: string
 *           example: 133q1234
 *         description: |
 *           검색할 때 필요한 랜덤 시드입니다.
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: int
 *           example: 0
 *         description: |
 *           12개 단위
 *       - in: query
 *         name: min_price_range
 *         required: true
 *         schema:
 *           type: int
 *         description: |
 *           최소 입력가격
 *           * 1만미만: 1000 ~ 9990
 *           * 1~2만원대: 10000 ~ 29990
 *           * 3~4만원대: 30000 ~ 49990
 *           * 5~6만원대: 50000 ~ 69990
 *           * 7~9만원대: 70000 ~ 99990
 *           * 10만원 이상: 100000 ~ 100000000
 *         enum: [1000,10000,30000,50000,70000,100000]
 *       - in: query
 *         name: max_price_range
 *         required: true
 *         schema:
 *           type: int
 *         description: |
 *           최대 입력가격
 *           * 1만미만: 1000 ~ 9990
 *           * 1~2만원대: 10000 ~ 29990
 *           * 3~4만원대: 30000 ~ 49990
 *           * 5~6만원대: 50000 ~ 69990
 *           * 7~9만원대: 70000 ~ 99990
 *           * 10만원 이상: 100000 ~ 100000000
 *         enum: [9990,29990,49990,69990,99990,100000000]
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

            req.innerBody['price_range'] = await queryProductPriceRange(req, db_connection); // 지금뜨는 공구딜

            console.log(req.innerBody['price_range'])
            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });
    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

//'가격대별 인기상품' 사실 새로 api를 파야한다.
function queryProductPriceRange(req, db_connection){
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_price_range_preview_list_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['random_seed'],
            req.paramBody['offset'],
            req.paramBody['category'],
            req.paramBody['min_price_range'],
            req.paramBody['max_price_range']
        ]
    );
}