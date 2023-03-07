/**
 * Created by yunhokim on 2022. 12. 12.
 *
 * @swagger
 * /api/public/v2/searchview/participant/list:
 *   get:
 *     summary: 인원별 공구 참여
 *     tags: [v2SearchView]
 *     description: |
 *       path : /api/public/v2/searchview/participant/list:
 *
 *       * ## 인원별 공구 참여 더보기
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
 *         name: room_type
 *         default: 2
 *         required: true
 *         schema:
 *           type: number
 *           example: 2
 *         description: |
 *           검색할 공구방 타입을 입력합니다.
 *         enum: [2,5,10]
 *       - in: query
 *         name: is_room
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           열린 공구방이 있는 상품만 표시합니다.
 *           * 0: 전체
 *           * 1: 열린 공구방만 보기
 *         enum: [0,1]
 *       - in: query
 *         name: filter_type
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           각종 필터 선택 리스트입니다
 *           * 0: 인기순 (추후 업데이트)
 *           * 1: 리뷰순 (추후 업데이트)
 *           * 2: 신상품순(사용)
 *           * 3: 저가순(사용)
 *           * 4: 고가순(사용)
 *           * 5: 할인율 높은순
 *         enum: [2,3,4,5]
 *
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
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            // let count_data = await querySelectCount(req, db_connection);
            req.innerBody['item'] = await queryParticipantStatus(req, db_connection);
            // req.innerBody['total_count'] = count_data['total_count'];

            deleteBody(req);
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
}

//인원별 공구 참여
function queryParticipantStatus(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_gongu_participant_status_list_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['random_seed'],
            req.paramBody['offset'],
            req.paramBody['room_type'],
            req.paramBody['is_room'],
            req.paramBody['filter_type'],
        ]
    );
}