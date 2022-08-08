/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v1/groupbuying/detail:
 *   get:
 *     summary: 상품 상세
 *     tags: [GroupBuying]
 *     description: |
 *       path : /api/private/v1/groupbuying/detail
 *
 *       * 상품 상세
 *
 *     parameters:
 *       - in: query
 *         name: product_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 3
 *         description: 상품 uid
 *       - in: query
 *         name: groupbuying_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 15
 *         description: 공구 uid
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
 *
 *     responses:
 *       200:
 *         description: 성공 결과 정보
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
        
        const item = queryDetail(req, db_connection);
        const image_list = queryImageList(req, db_connection);
        const image_detail_list = queryImageDetailList(req, db_connection);
        const qna_list = queryQnAList(req, db_connection);
        const item_types = queryDetailType(req, db_connection);
        const item_options = queryDetailOption(req, db_connection);
        const rooms = queryRoomUser(req, db_connection);
        const room_count = queryRoomCount(req, db_connection);

        const [
            item_data, image_list_data, 
            image_detail_list_data, qna_list_data, 
            item_types_data, item_options_data, 
            rooms_data, room_count_data] = await Promise.all([item, image_list, image_detail_list, qna_list, item_types, item_options, rooms, room_count])
        
        req.innerBody['item'] = item_data;

        req.innerBody.item['types'] = item_types_data;
        req.innerBody.item['options'] = item_options_data;
        req.innerBody.item['rooms'] = mapfunc(rooms_data);
        req.innerBody.item['room_count'] = room_count_data.count;
        req.innerBody['image_list'] = image_list_data;
        req.innerBody['image_detail_list'] = image_detail_list_data;
        req.innerBody['qna_list'] = qna_list_data;

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
    paramUtil.checkParam_noReturn(req.paramBody, 'product_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'groupbuying_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'latitude');
    paramUtil.checkParam_noReturn(req.paramBody, 'longitude');
}
 
function queryDetail(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_gongu_detail_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['groupbuying_uid'],
            req.paramBody['latitude'],
            req.paramBody['longitude'],
        ]
    );
}

function queryDetailType(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_gongu_detail_types_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['groupbuying_uid'],
        ]
    );
}

function queryDetailOption(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_gongu_detail_options_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['groupbuying_uid'],
        ]
    );
}

function queryImageList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_image_list'
        , [
            req.paramBody['product_uid'],
            2,
        ]
    );
}

function queryImageDetailList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_image_detail_list'
        , [
            req.paramBody['product_uid'],
            5,
        ]
    );
}

//  function queryFaqList(req, db_connection) {
//      const _funcName = arguments.callee.name;

//      return mysqlUtil.queryArray(db_connection
//          , 'call proc_select_faq_list'
//          , [
//              req.paramBody['product_uid'],
//          ]
//      );
//  }

function queryQnAList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_qna_list'
        , [
            req.headers['user_uid'],
            req.paramBody['product_uid'],
            0,
            3
        ]
    );
}

function mapfunc(item){
    return item.map(result =>{

        return {
            room_end_time: result.room_end_time,
            recruitment: result.recruitment,
            participants: result.participants,
            uid: result.uid,
            is_active: result.recruitment <= result.participants? 0:1,
            user: result.user.split('|').map(item=>{
                item = JSON.parse(item);

                return {
                    uid: item.uid,
                    is_head: item.is_head,
                    profile_image: item.profile_image,
                    user_uid: item.user_uid,
                    nickname: item.nickname
                }
            })
        }
    })
}

function queryRoomUser(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_groupbuying_room_user_v1'
        ,[ req.paramBody['groupbuying_uid']]
    );
}

function queryRoomCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_groupbuying_room_user_count_v1'
        ,[ req.paramBody['groupbuying_uid']]
    );
}