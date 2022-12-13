/**
 * Created by hyunhunhwang on 2021. 01. 19.
 *
 * @swagger
 * /api/private/v2/event/check:
 *   get:
 *     summary: 이벤트 당첨자 체크
 *     tags: [Event]
 *     description: |
 *       path : /api/private/v2/event/check
 *
 *       * ## 이벤트 당첨자 체크
 *       * ### 로그인 유저만 입력 가능
 *       * ### 배송비, 무료배송비, 도서산간 추가배송비 전달한다. 보내는 주소정보에 따라 배송비가 적용되야 한다.
 *
 *     parameters:
 *       - in: query
 *         name: event_code
 *         required: true
 *         schema:
 *           type: string
 *           example: abcdef
 *         description: 이벤트 코드
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
const errCode = require('../../../common/define/errCode');

const dateUtil = require('../../../common/utils/dateUtil')

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

            let event_data = await queryEventUser(req, db_connection);
            if(!event_data || event_data.length === 0){
                errUtil.createCall(errCode.err,'잘못된 이벤트 코드입력 입니다.')
            }

            const {year, month, date} = dateUtil()
            const today = new Date(`${year}-${month}-${date}`)
            event_data.forEach(el=>{
                if(el['is_checked'] === 1){
                    errUtil.createCall(errCode.err,'이미 사용된 이벤트 코드입니다.')
                }

                let endTime = new Date(el['end_time'])
                console.log(year, month, date)
                console.log(today)
                console.log(endTime)
                if(today >= endTime){
                    errUtil.createCall(errCode.err, '입력기한이 초과된 이벤트 코드입니다.')
                }

                if(el['is_deleted'] === 1 || el['is_authorize'] === 0){
                    errUtil.createCall(errCode.err, `${el['name']}상품이 준비중입니다.`)
                }
            })

            req.innerBody['item'] = event_data
            req.innerBody['message'] = '올바른 일련번호입니다.'

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
    paramUtil.checkParam_noReturn(req.paramBody, 'event_code');
    // paramUtil.checkParam_noReturn(req.paramBody, 'social_id');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function queryEventUser(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_event_user_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['event_code'],
        ]
    );
}



