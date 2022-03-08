/**
 * Created by yunhokim on 2022. 03. 07.
 *
 * @swagger
 * /api/private/alert:
 *   put:
 *     summary: 알림 on/off
 *     tags: [Alert]
 *     description: |
 *      * ## path : /api/private/alert
 *
 *      * ## 알림 on/off
 *      * ## 알림상태 (is_alert_status)
 *        * ### 0: 리뷰영상등록알림 on/off
 *        * ### 1: 상품구매확정알림 on/off
 *        * ### 2: 구매확정요청알림 on/off
 *        * ### 4: 댓글등록알림 on/off
 *        * ### 8: 대댓글등록알림 on/off
 *        * ### 16: 문의등록알림 on/off
 *      * ## 알림 on/off (is_alert_value)
 *        * ### 0: on
 *        * ### 1: off
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           알림 on/off
 *         schema:
 *           type: object
 *           required:
 *             - is_alert_status
 *             - is_alert_value
 *           properties:
 *             is_alert_status:
 *               type: number
 *               example: 0
 *               description: |
 *                 알림상태
 *                 * 0: 리뷰영상등록알림 on/off
 *                 * 1: 상품구매확정알림 on/off
 *                 * 2: 구매확정요청알림 on/off
 *                 * 4: 댓글등록알림 on/off
 *                 * 8: 대댓글등록알림 on/off
 *                 * 16: 문의등록알림 on/off
 *               enum: [0,1,2,4,8,16]
 *             is_alert_value:
 *               type: number
 *               example: 0
 *               description: |
 *                 알림 on/off
 *                 * 0: on
 *                 * 1: off
 *               enum: [0,1]
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
const jwtUtil = require('../../../common/utils/jwtUtil');

const errCode = require('../../../common/define/errCode');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};
            
            switch(req.paramBody['status']){
                case 0: {
                    req.innerBody['result'] = await query_order_confirm(req, db_connection);
                } break;
                case 1: {
                    req.innerBody['result'] = await query_order_confirm_request(req, db_connection);
                } break;
                case 2: {
                    req.innerBody['result'] = await query_comment(req, db_connection);
                } break;
                case 4: {
                    req.innerBody['result'] = await query_nested_comment(req, db_connection);
                } break;
                case 8: {
                    req.innerBody['result'] = await query_review_video(req, db_connection);
                } break;
                case 16: {
                    req.innerBody['result'] = await query_product_qna(req, db_connection);
                } break;

            }

            // req.innerBody['result'] = data['alert_message'];

            deleteBody(req)
            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        } );

    }
    catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function checkParam(req) {
    // paramUtil.checkParam_noReturn(req.paramBody, 'is_alert_review_video');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
}

// is_alert_order_confirm         tinyint(1) default 0                 null comment '상품 구매 확정 알림 - 판매자
// 판매자에게 주문내역이 구매확정이 되었다고 알림. fcm_type = 7, channel = 상품 구매 확정 알림
// 0: false
// 1: true',
function query_order_confirm(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_alert_order_confirm'
        , [
            req.headers['user_uid'],
            req.paramBody['is_alert_value'],
        ]
    );
}

// is_alert_order_confirm_request tinyint(1) default 0                 null comment '구매 확정 요청 알림
// 구매자에게 주문내역을 확정해달라는 알림. fcm_type = 9, channel = 구매 확정 요청 알림
// 0: false
// 1: true',
function query_order_confirm_request(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_alert_order_confirm_request'
        , [
            req.headers['user_uid'],
            req.paramBody['is_alert_value'],
        ]
    );
}

// is_alert_comment               tinyint(1) default 0                 null comment '댓글 등록 알림
// 영상에 댓글이 달렸다고 알림. fcm_type = 3, channel = 댓글 등록 알림
// 0: false
// 1: true',
function query_comment(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_alert_comment'
        , [
            req.headers['user_uid'],
            req.paramBody['is_alert_value'],
        ]
    );
}

// is_alert_nested_comment        tinyint(1) default 0                 null comment '대댓글 등록 알림
// 댓글에 대댓글이 달렸다는 알림. fcm_type = 4, channel = 대댓글 등록 알림
// 0: false
// 1: true',
function query_nested_comment(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_alert_nested_comment'
        , [
            req.headers['user_uid'],
            req.paramBody['is_alert_value'],
        ]
    );
}

// is_alert_review_video          tinyint(1) default 0                 null comment '리뷰 영상 등록 알림 - 판매자
// 판매자 상품에 리뷰영상이 등록됨을 알림. fcm_type = 1, channel = 리뷰 영상 등록 알림
// 0: false
// 1: true',
function query_review_video(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_alert_review_video'
        , [
            req.headers['user_uid'],
            req.paramBody['is_alert_value'],
        ]
    );
}

// is_alert_product_qna           tinyint(1) default 0                 null comment '문의 등록 알림 - 판매자
// 문의등록이나 문의답변을 알림. fcm_type = 0(문의등록) channel = 문의 등록 알림
// 0: false
// 1: true',
function query_product_qna(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_alert_product_qna'
        , [
            req.headers['user_uid'],
            req.paramBody['is_alert_value'],
        ]
    );
}





