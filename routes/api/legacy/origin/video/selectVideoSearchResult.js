/**
 * Created by kimyunho on 2021. 11. 24.
 *
 * @swagger
 * /api/private/video/search/result/list:
 *   get:
 *     summary: 비디오 카테고리 검색 목록
 *     tags: [Video]
 *     description: |
 *       path : /api/private/video/search/result/list
 *
 *       * 비디오 카테고리 검색 목록
 *       * 검색 목록은 랜덤으로 주기 때문에 page 개념이 없습니다.
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
 *           ==> 65535 : 모든 상품
 *           ==> 멀티선택의 경우 코드 값을 합치면됨
 *           ==> ex) 1+8+32 = 41
 *           * 1 : 식품
 *           * 2 : 뷰티
 *           * 4 : 홈데코
 *           * 8 : 패션잡화
 *           * 16 : 반려동물
 *           * 32 : 유아
 *           * 64 : 스포츠레저
 *           * 128 : 식물
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
 *           페이지 시작 값을 넣어주시면 됩니다. Limit 30
 *           offset 0: 0~30
 *           offset 30: 30~60
 *           offset 60: 60~90
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/VideoSearchResultListApi'
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
        logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await querySelect(req, db_connection);
            let count = await queryCount(req, db_connection);
            req.innerBody['count'] = count['count']

            console.log(req.innerBody['count'])
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
    paramUtil.checkParam_noReturn(req.paramBody, 'random_seed');
    paramUtil.checkParam_noReturn(req.paramBody, 'offset');
}

function deleteBody(req) {
    for( let idx in req.innerBody['item'] ){
        delete req.innerBody['item'][idx]['filename']
    }
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_video_search_result'
        , [
            req.headers['user_uid'],
            req.paramBody['category'],
            req.paramBody['random_seed'],
            req.paramBody['offset'],
        ]
    );
}

function queryCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_video_search_result_count'
        , [
            req.headers['user_uid'],
            req.paramBody['category'],
        ]
    );
}
