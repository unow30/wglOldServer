/**
 * Created by yunhokim on 2022. 12. 07.
 *
 * @swagger
 * /api/public/v2/searchview/best/product/list:
 *   get:
 *     summary: 인기상품 랭킹 더보기
 *     tags: [v2SearchView]
 *     description: |
 *       path : /api/public/v2/searchview/best/product/list
 *
 *       * ## 인기상품 랭킹 더보기
 *       * ### offset으로 패이징한다.
 *
 *     parameters:
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
 *           페이지 시작 값을 넣어주시면 됩니다. 호출당 Limit 12
 *           offset 0: 0~11
 *           offset 12: 12~23
 *           offset 24: 24~35
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
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};
            const {year, month, weekNo, date} = dateUtil();
            const week = `${month}${weekNo}`;
            const day = `${year}${month}${date}`
            req.innerBody['item'] = await queryBestProduct(req, db_connection, week);

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
    // paramUtil.checkParam_noReturn(req.paramBody, 'user_uid');
    // paramUtil.checkParam_noReturn(req.paramBody, 'last_uid');
}

function deleteBody(req) {
}


function queryBestProduct(req, db_connection, date) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_best_product_v2'
        , [
            req.headers['user_uid'],
            date,
            req.paramBody['offset'],
            req.paramBody['category']
        ]
    );
};

