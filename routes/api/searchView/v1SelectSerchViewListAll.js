/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v1/searchview/list/all:
 *   get:
 *     summary: 모아보기 모든 화면 불러오기
 *     tags: [SearchView]
 *     description: |
 *      ## path : /api/private/v1/searchview/list/all
 *
 *       * ## 모아보기 모든 화면 불러오기 (인기 카테고리 목록 제외)
 *         * ### 성공임박 공구 목록
 *         * ### 지금뜨는 공구딜 목록
 *         * ### 시간 얼마 안남은 공구 목록
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
        
        checkParam(req);
        mysqlUtil.connectPool(async function (db_connection) {
        req.innerBody = {};

        const ad_list = queryADList(req, db_connection);
        const last_order = queryLastOrder(req, db_connection); // 성공임박 공구
        const gongu_deal = queryGonguDeal(req, db_connection); // 지금뜨는 공구딜
        const gongu_deadline = queryGonguDeadline(req, db_connection); // 시간이 얼마 안남은 공구
        const hot_weggler = queryHotWeggler(req, db_connection); //핫 위글러 리스트 및 동영상 데이터
        const edition = queryEdition(req, db_connection); // 기획전 상품
        const mdPick = queryMdPick(req, db_connection); // mdPick

        const {month, weekNo} = dateUtil();
        const date = `${month}${weekNo}`;
        const bestProduct = queryBestProduct(req, db_connection, date); // 베스트 프로덕트

        const [last_order_data, gongu_deal_data, 
            gongu_deadline_data, ad_list_data, 
            hot_weggler_data, edition_data,
            md_pick_data, best_product_data] = await Promise.all([last_order, gongu_deal, gongu_deadline, ad_list, hot_weggler, edition, mdPick, bestProduct])

        const hot_weggler_parse = hotWegglerParse(hot_weggler_data);
        const edition_parse = editionParse(edition_data);

        req.innerBody['hot_weggler'] = hot_weggler_parse;
        req.innerBody['last_order'] = last_order_data;
        req.innerBody['gongu_deal'] = gongu_deal_data;
        req.innerBody['gongu_deadline'] = gongu_deadline_data;
        req.innerBody['ad_list'] = ad_list_data;
        req.innerBody['edition'] = edition_parse;
        req.innerBody['md_pick'] = md_pick_data;
        req.innerBody['best_product'] = best_product_data;

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
    // paramUtil.checkParam_noReturn(req.paramBody, 'product_uid');
    // paramUtil.checkParam_noReturn(req.paramBody, 'latitude');
    // paramUtil.checkParam_noReturn(req.paramBody, 'longitude');
}
function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function queryLastOrder(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_gongu_last_order_v1'
        , [
            req.headers['user_uid'],
        ]
    );
}

function queryGonguDeal(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_gongu_deal_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['random_seed'],
            0, //offset
        ]
    );
}

function queryGonguDeadline(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_gongu_deadline_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['random_seed'],
            0, //offset
        ]
    );
}

function queryADList(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_ad_list_v1'
        , [
            req.headers['user_uid'],
            // req.paramBody['product_uid'],
        ]
    );
}

function queryHotWeggler(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_hot_weggler_list_v1'
        , [
            req.headers['user_uid'],
            // req.paramBody['product_uid'],
        ]
    );
}

function hotWegglerParse(hotWeggler) {
    return hotWeggler.map(item=>{
        return {
            user_uid: item.user_uid,
            amount: item.amount,
            video_count: item.video_count,
            user_profile_image: item.user_profile_image,
            user_nickname: item.user_nickname,
            video_info: item.video_info? item.video_info.split('@!@').map(info_item=> JSON.parse(info_item)) : []
        }
    })
}

function queryEdition(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_gongu_edition_v1'
        , [
            req.headers['user_uid'],
            // req.paramBody['product_uid'],
        ]
    );
}

function editionParse(edition) {
    return edition.map(item=>{
        return {
            edition_uid: item.edition_uid,
            edition_filename: item.edition_filename,
            start_time: item.start_time,
            end_time: item.end_time,
            edition_name: item.edition_name,
            edition_list: item.edition_list? item.edition_list.split('@!@').map(info_item=> JSON.parse(info_item)) : []
        }
    })
}

function queryMdPick(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_md_pick_v1'
        , [
            req.headers['user_uid'],
        ]
    );
};

function queryBestProduct(req, db_connection, date) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_best_product_v1'
        , [
            req.headers['user_uid'],
            date
        ]
    );
};