/**
 * Created by yunhokim on 2022. 10. 13.
 *
 * @swagger
 * /api/public/v1/feed/product/list:
 *   get:
 *     summary: 피드 상품목록 (테섭전용)
 *     tags: [Feed]
 *     description: |
 *       path : /api/public/v1/feed/product/list
 *
 *       * 피드 상품목록 (테섭전용)
 *       * 해당 영상에 등록된 상품정보를 보여준다.
 *
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         default: 65535
 *         schema:
 *           type: number
 *           example: 65535
 *         description: |
 *           카테고리 (비트 연산)
 *           해당값으로 상품목록 정렬
 *           ==> 65535 : 모든 상품
 *           * 1 : 식품
 *           * 2 : 뷰티
 *           * 4 : 홈데코
 *           * 8 : 패션잡화
 *           * 16 : 반려동물
 *           * 32 : 유아
 *           * 64 : 스포츠레저
 *           * 128 : 식물
 *       - in: query
 *         name: video_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 605
 *         description: 비디오uid
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
        logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await querySelect(req, db_connection); //type이 1이면 in_video_uid제외한 정보가 있다.

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
    paramUtil.checkParam_noReturn(req.paramBody, 'category');
    // paramUtil.checkParam_noReturn(req.paramBody, 'ad_product_uid');
}

function deleteBody(req) {
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

        return mysqlUtil.queryArray(db_connection
            , 'call proc_select_feed_product_list_v1'
            , [
                req.paramBody['category'],
                req.paramBody['video_uid'],
            ]
        );
}
