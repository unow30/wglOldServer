/**
 * Created by yunhokim on 2022. 10. 24.
 *
 * @swagger
 * /api/private/v2/feed/review/list:
 *   get:
 *     summary: 피드 대표상품 리뷰 리스트
 *     tags: [Feed]
 *     description: |
 *       path : /api/private/v2/feed/review/list
 *
 *       * 피드 대표상품 리뷰 리스트
 *       * 피드리스트에서 리뷰버튼을 클릭하면 해당 비디오의 대표상품의 리뷰리스트를 불러온다. (사진,영상)
 *       * 필터링: 0: 비디오 없음, 1: 비디오 있음, 2: 전체
 *       * 정렬하기: 1: 최신순(영상승인날짜), 2:좋아요수+조회수, 3:추천순은 선호태그의 랜덤 => 우선 조회수로 진행
 *
 *     parameters:
 *       - in: query
 *         name: product_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 100052
 *         description: |
 *           상품uid
 *           테스트 상품uid 추천: 100104,100052,100102
 *           매인 상품uid 추천: 2227,2526,2545
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           페이지 시작 값을 넣어주시면 됩니다. Limit 18
 *           offset 0: 0~17
 *           offset 18: 18~35
 *           offset 36: 36~53
 *       - in: query
 *         name: filter
 *         required: true
 *         schema:
 *           type: number
 *           example: 2
 *         description: |
 *           리뷰종류 필터링
 *           * 사진리뷰만: 0
 *           * 영상리뷰먄: 1
 *           * 전체: 2
 *         enum: [0,1,2]
 *       - in: query
 *         name: sort
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: |
 *           정렬하기
 *           * 1: 최신순(영상승인날짜)
 *           * 2: 좋아요순(조회수+좋아요수)
 *           * 3: 추천순(선호태그의 랜덤 => 우선 조회수로 정렬)
 *         enum: [1,2,3]
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/FeedListApi'
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
        logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await querySelect(req, db_connection);

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
}

function deleteBody(req) {
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_feed_review_list_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
            req.paramBody['offset'],
            req.paramBody['filter'],
            req.paramBody['sort'],
        ]
    );
}
