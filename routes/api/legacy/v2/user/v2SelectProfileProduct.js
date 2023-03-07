/**
 *
 * @swagger
 * /api/public/v2/user/info/product:
 *   get:
 *     summary: 유저 프로필 판매상품 리스트
 *     tags: [User]
 *     description: |
 *       ## path : /api/public/v2/user/info/product
 *
 *       * ### 유저 프로필 판매상품 리스트
 *       * ### 판매자일 경우 '상점방문' <--> '피드보기' 토글버튼을 누르면 실행
 *       * ### 상품정보 검색, 무료배송, 정렬필터링 추가
 *       * ### limit 20개씩 이므로 offset 20개씩 증가
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
 *       - in: query
 *         name: keyword
 *         default: null
 *         required: true
 *         schema:
 *           type: string
 *           example:
 *         description: 상품이름 검색
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
 *           * 0: 인기순(기본값, 랜덤)
 *           * 1: 리뷰순
 *           * 2: 신상품순(상품승인 최신순)
 *           * 3: 저가순
 *           * 4: 고가순
 *           * 5: 할인율순(안쓴다)
 *         enum: [0,1,2,3,4]
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
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           페이지 시작 값을 넣어주시면 됩니다. Limit 20
 *           offset 0: 0~19
 *           offset 20: 20~39
 *           offset 40: 40~59
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

            req.innerBody['item'] = await querySelect(req, db_connection);

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
        , 'call proc_select_user_info_product_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['user_uid'],
            req.paramBody['keyword']? req.paramBody['keyword'] : null, //null로 줘야 변수개수를 맞춘다.
            req.paramBody['delivery_free']? req.paramBody['delivery_free'] : 0, //무료배송 x 일반배송 o
            req.paramBody['filter_type']? req.paramBody['filter_type']: 2, //상품승인 최신순
            req.paramBody['random_seed']? req.paramBody['random_seed']: '123abc456', //filter_type: 0일때 필요
            req.paramBody['offset'],
        ]
    );
}