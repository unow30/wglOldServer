/**
 * Created by yunhokim
 *
 * @swagger
 * /api/public/v2/searchview/list/all:
 *   get:
 *     summary: 모아보기 모든 화면 불러오기
 *     tags: [SearchView]
 *     description: |
 *      ## path : /api/public/v2/searchview/list/all
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

        errUtil.createCall(400, '일반적인 에러 보냅니다.')

        const ad_list = queryADList(req, db_connection); //배너광고리스트
        const last_view = queryLastViewList(req, db_connection) //최근 본 상품 목록
        const last_order = queryLastOrder(req, db_connection); // 성공임박 공동구매
        const brand_list = queryBrandUserList(req, db_connection) //브랜드관 배너 이미지 목록
        const interest_list = queryInterestsList(req, db_connection)//취향저격 상품 목록
        const newReviewProduct = queryNewReviewPreviewList(req, db_connection); //신규 리뷰 영상 목록
        const gongu_video_list= queryGonguFeedList(req, db_connection)//공구영상리스트
        // const banner_list = '배너띠 목록?'
        const edition = queryEdition(req, db_connection); //기획전 상품 mdPick 배너리스트 보여주기

        const {month, weekNo} = dateUtil();
        const date = `${month}${weekNo}`;
        const bestProduct = queryBestProduct(req, db_connection, date); //베스트 프로덕트 인기상품랭
        const price_list = queryProductPriceRange(req, db_connection)//'가격대별 인기상품'

        //안쓰는 데이터??
        const mdPick = queryMdPick(req, db_connection); //mdPick
        const gongu_deal = queryGonguDeal(req, db_connection); // 지금뜨는 공구딜
        const gongu_deadline = queryGonguDeadline(req, db_connection); // 시간이 얼마 안남은 공구
        const hot_weggler = queryHotWeggler(req, db_connection); //핫 위글러 리스트 및 동영상 데이터



        const [
            ad_list_data,
            last_order_data,
            last_view_data,
            brand_list_data,
            interest_data,
            new_review_product_data,
            gongu_video_data,
            //배너띠
            edition_data,
            best_product_data,
            price_data,
            // md_pick_data,
            // hot_weggler_data,
            // gongu_deal_data,
            // gongu_deadline_data,
        ] = await Promise.all([
            ad_list,
            last_order,
            last_view,
            brand_list,
            interest_list,
            newReviewProduct,
            gongu_video_list,
            //배너띠
            edition,
            bestProduct,
            price_list,
            // mdPick,
            // hot_weggler,
            // gongu_deal,
            // gongu_deadline,
        ])

        // const hot_weggler_parse = hotWegglerParse(hot_weggler_data); //핫 위글러 리스트 및 동영상 데이터
        const edition_parse = editionParse(edition_data);
        //기존대로 작동
        req.innerBody['ad_list'] = ad_list_data

        req.innerBody['last_view'] = createProperties(last_view_data)
        req.innerBody['last_view']['title'] = '최근 본 상품'
        req.innerBody['last_view']['subTitle'] = '눈여겨본 상품 놓치지 마세요'


        req.innerBody['last_order'] = createProperties(last_order_data)
        req.innerBody['last_order']['title'] = '성공임박 공동구매'
        req.innerBody['last_order']['subTitle'] = '서두르세요 마지막 한명!'

        req.innerBody['brand_list'] = createProperties(brand_list_data)
        req.innerBody['brand_list']['title'] = '위글에서 사랑받는 브랜드'
        req.innerBody['brand_list']['subTitle'] = '위글러들이 많이 구매한 브랜드'

        req.innerBody['interest_data'] = createProperties(interest_data)
        req.innerBody['interest_data']['title'] = 'ooo님의 취향저격 상품'
        req.innerBody['interest_data']['subTitle'] = '최근 본 상품과 유사한 상품들을 모아봤어요!'

        req.innerBody['new_review_preview_list'] = createProperties(new_review_product_data)
        req.innerBody['new_review_preview_list']['title'] = '따끈따끈 신규 리뷰영상'
        req.innerBody['new_review_preview_list']['subTitle'] = '새로 올라온 리뷰영상을 확인해 보세요'

        req.innerBody['gongu_video_list'] = createProperties(gongu_video_data)
        req.innerBody['gongu_video_list']['title'] = '영상으로 만나는 공동구매'
        req.innerBody['gongu_video_list']['subTitle'] = '생생한 숏폼 영상으로 리얼하게!'
        //배너띠 보내기
        req.innerBody['edition'] = createProperties(edition_parse)
        req.innerBody['edition']['title'] = 'ONLY 위글, 기획전'
        req.innerBody['edition']['subTitle'] = '테마별로 기획전을 만나보세요'

        req.innerBody['best_product'] = createProperties(best_product_data)
        req.innerBody['best_product']['title'] = '인기 상품 랭킹'
        req.innerBody['best_product']['subTitle'] = '위글의 인기 상품을 만나보세요'

        req.innerBody['prict_range_data'] = createProperties(price_data)
        req.innerBody['prict_range_data']['title'] = '가격대별 인기 상품'
        req.innerBody['prict_range_data']['subTitle'] = '가격대별로 인기 상품을 만나보세요'


        // req.innerBody['md_pick'] = md_pick_data
        // req.innerBody['hot_weggler'] = hot_weggler_parse; //핫 위글러 리스트 및 동영상 데이터
        // req.innerBody['gongu_deal'] = gongu_deal_data; // 지금뜨는 공구딜
        // req.innerBody['gongu_deadline'] = gongu_deadline_data; //시간이 얼마 안남은 공구

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

// 성공임박 공동구매
function queryLastOrder(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_gongu_last_order_v2'
        , [
            req.headers['user_uid'],
            //req.paramBody['offset']
            0
        ]
    );
}

// 지금뜨는 공구딜
function queryGonguDeal(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_gongu_deal_v1'
        , [
            req.headers['user_uid'],
            65535, //전체 카테고리 상품 보여주기
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

//배너광고리스트
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

//기획전 상품 mdPick
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

//mdPick
function queryMdPick(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_md_pick_v1'
        , [
            req.headers['user_uid'],
        ]
    );
};

//베스트 프로덕트 인기상품랭
function queryBestProduct(req, db_connection, date) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_best_product_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['random_seed'],
            0// req.paramBody['offset'],
        ]
    );
};

//신규 리뷰 영상 목록
function queryNewReviewPreviewList(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_new_review_preview_list_v2'
        , [
            req.headers['user_uid'],
            0, // req.paramBody['offset'],
        ]
    );
};

//최근 본 상품 목록
function queryLastViewList(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_recent_viewed_list_v2'
        , [
            req.headers['user_uid'],
            0,// req.paramBody['offset'],
        ]
    );
}

//브랜드관 배너 이미지 목록
function queryBrandUserList(req, db_connection){
    const _funcName = arguments.callee.name;

    //배너이미지 이름이 한글이고 이미지 가운데 이름을 붙인다.
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_promotion_user_list_v2'
        , [
            req.paramBody['random_seed']
        ]
    );
}

//공구영상리스트
function queryGonguFeedList(req, db_connection){
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_gongu_feed_list_v1'
        , [
            req.headers['user_uid'],
            req.paramBody['random_seed'],
            0,//req.paramBody['offset'],
            0,//req.paramBody['filter'],
            65535,//req.paramBody['category'],
        ]
    );
}

//'가격대별 인기상품' 사실 새로 api를 파야한다.
function queryProductPriceRange(req, db_connection){
    return mysqlUtil.queryArray(db_connection
            , 'call proc_select_searchview_price_range_preview_list_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['random_seed'],
            0, //req.paramBody['offset'],
            65535,//req.paramBody['category'],
            1000, //req.paramBody['min_price_range'] 0원은 없으니 1000원이라고 잡자 100원 10원도 없어 나오는게 이상해
            9990 //req.paramBody['max_price_range']
        ]
    );
}

function queryInterestsList(req, db_connection){
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_interests_product_list_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['random_seed'],
            0, //req.paramBody['offset'],
        ]
    );
}

function createProperties(data) {
    return {
        'title': '',
        'subTitle': '',
        'data': data
    }
}