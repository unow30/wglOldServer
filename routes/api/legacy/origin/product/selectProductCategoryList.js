/**
 * Created by yunhokim on 2022. 05. 20.
 *
 * @swagger
 * /api/public/product/category/list:
 *   get:
 *     summary: 상품카테고리목록(220601부터 카테고리탭 생성됨)
 *     tags: [Category]
 *     description: |
 *       path : /api/public/product/category/list
 *
 *       * 상품카테고리목록(220601부터 카테고리탭 생성됨)
 *       * 221212 스웨거 수정
 *
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: number
 *           example: 65535
 *         description: |
 *           상품 카테고리
 *           * 1: 식품
 *           * 2: 뷰티/주얼리
 *           * 4: 인테리어
 *           * 8: 패션잡화
 *           * 16: 반려동물
 *           * 32: 생활용품
 *           * 65535: 전체
 *         enum: [1,2,4,8,16,32,65535]
 *       - in: query
 *         name: random_seed
 *         required: true
 *         schema:
 *           type: string
 *           example: 133q1234
 *         description: |
 *           검색할 때 필요한 랜덤 시드입니다.
 *       - in: query
 *         name: is_deal
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           위글딜 여부 필터링입니다.(안쓰는값 고정으로 0)
 *           * 0: 전체표시
 *           * 1: 위글딜표시
 *         enum: [0,1]
 *       - in: query
 *         name: delivery_free
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           배송비 무료 여부 필터링입니다.(안쓰는값 고정 0)
 *           * 0: 전체
 *           * 1: 배송비무료
 *         enum: [0,1]
 *       - in: query
 *         name: filter_type
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           각종 필터 선택 리스트입니다
 *           * 0: 인기순(기본값, 사용)
 *           * 1: 리뷰순(안쓴다)
 *           * 2: 신상품순(최신순, 사용)
 *           * 3: 저가순(사용)
 *           * 4: 고가순(사용)
 *           * 5: 할인율순(안쓴다)
 *         enum: [0,1,2,3,4,5]
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           페이지 시작 값을 넣어주시면 됩니다. Limit 12
 *           offset 0: 0~11
 *           offset 12: 12~23
 *           offset 24: 24~35
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

            req.innerBody['item'] = await queryUser(req, db_connection);

            // req.innerBody['item'] = await queryVideo(req, db_connection);

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
    // paramUtil.checkParam_noReturn(req.paramBody, 'category');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function queryUser(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_category_product_list_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['random_seed'],
            req.paramBody['category'],
            req.paramBody['is_deal'],
            req.paramBody['delivery_free'],
            req.paramBody['filter_type'],
            req.paramBody['offset'],
        ]
    );
}