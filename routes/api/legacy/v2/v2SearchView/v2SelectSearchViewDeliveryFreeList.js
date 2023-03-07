/**
 * Created by yunhokim on 2022. 12. 07.
 *
 * @swagger
 * /api/public/v2/searchview/delivery/free:
 *   get:
 *     summary: 무료배송상품 더보기
 *     tags: [v2SearchView]
 *     description: |
 *       path : /api/public/v2/searchview/delivery/free
 *
 *       * ## 무료배송상품 더보기
 *       * ### 홈뷰에서 띠배너 클릭해서 들어온 화면
 *       * ### /product/category/list api 내용 복붙
 *       * proc_select_category_product_list_v2로 해서 is_like 적용
 *       * 추후 /api/public/v2/searchview/category/list로 모든 카테고리를 표현하고 이 api는 제거한다.
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
 *           * 2: 뷰티
 *           * 4: 홈데코
 *           * 8: 패션잡화
 *           * 16: 반려동물
 *           * 32: 유아
 *           * 64: 스포츠레저
 *           * 128: 식물
 *           * 65535: 전체
 *         enum: [1,2,4,8,16,32,64,128,65535]
 *       - in: query
 *         name: random_seed
 *         required: true
 *         schema:
 *           type: string
 *           example: 133q1234
 *         description: |
 *           검색할 때 필요한 랜덤 시드입니다.
 *       - in: query
 *         name: filter_type
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           각종 필터 선택 리스트입니다
 *           * 0: 인기순(기본값)
 *           * 1: 리뷰순
 *           * 2: 신상품순
 *           * 3: 저가순
 *           * 4: 고가순
 *           * 5: 할인율순
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

            req.innerBody['item'] = await queryCategory(req, db_connection);

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

function queryCategory(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_category_product_list_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['random_seed'],
            req.paramBody['category'],
            0,// req.paramBody['is_deal'], 0: 전체표시,1:위글딜표시
            1,// req.paramBody['delivery_free'],0: 전체,1:배송비무료
            req.paramBody['filter_type'],
            req.paramBody['offset'],
        ]
    );
}