/**
 * Created by yunhokim on 2023. 01. 17.
 *
 * @swagger
 * /api/public/v2/searchview/banner/event:
 *   get:
 *     summary: 배너 이벤트 api
 *     tags: [v2SearchView]
 *     description: |
 *      ## path : /api/public/v2/searchview/banner/event
 *
 *         * ## 배너클릭시 이벤트페이지로 이동하기
 *         * ## 230117기준 위글 밀키트 모음전 뷰를 위한 데이터를 보내준다.
 *         * ## 두줄씩 26개 상품 표시, 인기순(랜덤)으로만 표시, 다른 필터링이나 기능 없다.
 *         * ## 기획전 edition_uid를 받아서 기획전 상품정보를 전달한다.
 *         * ## 기획전 이벤트가 진행중인 경우에만 데이터를 볼 수 있다.
 *
 *
 *     parameters:
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           페이지네이션 숫자
 *       - in: query
 *         name: random_seed
 *         required: true
 *         schema:
 *           type: string
 *           example: 133q1234
 *         description: |
 *           검색할 때 필요한 랜덤 시드입니다.
 *       - in: query
 *         name: edition_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           기획전 uid
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
const dateUtil = require('../../../../../common/utils/legacy/origin/dateUtil');

let file_name = fileUtil.name(__filename);
module.exports = function (req, res) {
    const _funcName = arguments.callee.name;
    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};
            // console.log(req.params.event)
            // if(req.params.event === 'mealkit'){
            // }
            const {year, month, weekNo, date} = dateUtil();
            const week = `${month}${weekNo}`;
            const day = `${year}${month}${date}`;

            req.innerBody['item'] = await queryEventMealkitList(req, db_connection, day); //이벤트 실행, 밀키트

            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });
    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function queryEventMealkitList(req, db_connection, date){
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_banner_event_list_v2'
        , [
            req.headers['user_uid'],
            date,
            req.paramBody['random_seed'],
            req.paramBody['edition_uid'],
            req.paramBody['offset'],
        ]
    );
}