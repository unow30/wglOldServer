/**
 * Created by hyunhunhwang on 2021. 01. 07.
 *
 * @swagger
 * /api/private/feed/list:
 *   get:
 *     summary: 피드 목록
 *     tags: [Feed]
 *     description: |
 *       path : /api/private/feed/list
 *
 *       * 피드 목록
 *       * 피드 목록은 랜덤으로 주기 때문에 page 개념이 없습니다.
 *       * 만약 위글 광고 클릭후 처음 목록 다음에 피드 목록을 새로 요청할때는 ad_product_uid 는 0으로 보내주세요
 *
 *     parameters:
 *       - in: query
 *         name: latitude
 *         default: 37.536977
 *         required: true
 *         schema:
 *           type: number
 *           example: 37.536977
 *         description: 위도 ( ex - 37.500167 )
 *       - in: query
 *         name: longitude
 *         default: 126.955242
 *         required: true
 *         schema:
 *           type: number
 *           example: 126.955242
 *         description: 경도 ( ex - 126.955242 )
 *       - in: query
 *         name: km
 *         default: 1000
 *         required: true
 *         schema:
 *           type: number
 *           example: 1000
 *         description: |
 *           검색 거리(단위 km)
 *           * 전체: 1000
 *           * 내 주변: 1, 3, 5, 10
 *         enum: [1,3,5,10,1000]
 *       - in: query
 *         name: category
 *         required: true
 *         default: 65535
 *         schema:
 *           type: number
 *           example: 65535
 *         description: |
 *           카테고리 (비트 연산)
 *           ==> 65535 : 모든 상품
 *           ==> 멀티선택의 경우 코드 값을 합치면됨
 *           ==> ex) 1+8+32 = 41
 *           * 1 : 수제 먹거리
 *           * 2 : 음료
 *           * 4 : 인테리어 소품
 *           * 8 : 악세사리
 *           * 16 : 휴대폰 주변기기
 *           * 32 : 비누/캔들
 *           * 64 : 가죽 공예
 *           * 128 : 꽃
 *           * 256 : 반려견
 *       - in: query
 *         name: ad_product_uid
 *         required: true
 *         default: 0
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           광고 상품 uid
 *           * 광고 상품이 없을 경우 0
 *       - in: query
 *         name: video_uid
 *         required: true
 *         default: 0
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           영상 uid
 *           * 영상이 없을 경우 0
 *       - in: query
 *         name: keyword
 *         required: false
 *         schema:
 *           type: string
 *           example:
 *         description: 검색 키워드(상품명 검색)
 *       - in: query
 *         name: tag
 *         required: false
 *         schema:
 *           type: string
 *           example: 핸드폰
 *         description: |
 *           해시태그 (영상 기준)
 *           * "핸드폰" 과 같이 #이 붙은 것만 검색됨
 *
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/Feed'
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
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

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
    paramUtil.checkParam_noReturn(req.paramBody, 'latitude');
    paramUtil.checkParam_noReturn(req.paramBody, 'longitude');
    paramUtil.checkParam_noReturn(req.paramBody, 'km');
    paramUtil.checkParam_noReturn(req.paramBody, 'category');
    paramUtil.checkParam_noReturn(req.paramBody, 'ad_product_uid');

    if(!paramUtil.checkParam_return(req.paramBody, 'keyword')){
        req.paramBody['keyword'] = null
    }
    if(!paramUtil.checkParam_return(req.paramBody, 'tag')){
        req.paramBody['tag'] = null
    }
}

function deleteBody(req) {
    for( let idx in req.innerBody['item'] ){
        delete req.innerBody['item'][idx]['filename']
    }
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_feed_list'
        , [
            req.headers['user_uid'],
            req.paramBody['latitude'],
            req.paramBody['longitude'],
            req.paramBody['km'],
            req.paramBody['category'],
            req.paramBody['ad_product_uid'],
            req.paramBody['video_uid'],
            req.paramBody['keyword'],
            req.paramBody['tag'],
        ]
    );
}
