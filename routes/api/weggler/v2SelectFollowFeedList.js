/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/weggler/follow/feed/list:
 *   get:
 *     summary: 팔로우한 사람들의 최신 피드목록 불러오기
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/follow/feed/list
 *
 *       * 팔로우한 사람들의 최신 피드목록 불러오기
 *       * limit 20 이므로 offset 20씩 증가
 * 
 *     parameters:
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           offset
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

        mysqlUtil.connectPool(async function (db_connection) {
        req.innerBody = {};
        req.paramBody['followList'] = await queryFollowList(req, db_connection); //로그인 한 유저의 팔로우 리스트
        req.paramBody['followList'] = req.paramBody['followList'].map(el=> el.user_uid)
        req.paramBody['followList'].push(req.headers['user_uid'])

        req.innerBody['item'] = await queryFollowFeedList(req, db_connection);
        req.innerBody['item'] = feedListParse(req.innerBody['item'])
        
        //추천 위글러 추가되서 들어가야함

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

async function queryFollowList(req, db_connection) {
    const _funcName = arguments.callee.name;
    const query = `
        select
            _follow.target_uid as user_uid
        from tbl_follow as _follow

        where _follow.source_uid = ${req.headers['user_uid']};
    `
    return await new Promise((resolve, reject)=>{
        db_connection.query(query,(err, rows, field)=>{
            if(err){
                const date = new Date(Date.now())
                
                reject(new Error(err.message +=`follow feed list 에서 에러 난 것 ${date}` || 'db error'))
            }
            resolve(rows)
        });
    }).catch(err => {throw err})
    
}

async function queryFollowFeedList(req, db_connection) {
    const _funcName = arguments.callee.name;

// 로그인 한 유저의 모든 팔로워의 피드들을 가져오는 쿼리 
// is_photo_review = 0(비디오 리뷰일 경우), 1(포토 리뷰일 경우) // my_review = 0(내 리뷰가 아닐경우), 1(내 리뷰일 경우)
// comment_count = 댓글의 수만 가져옴 대댓글은 x
// 111~189줄 쿼리는 포토리뷰에 대한 쿼리, 193~315줄 쿼리는 영상리뷰에 대한 쿼리
// 
// 
// 
// 
// 
//     
    const query = `
        (
            select
                1 as is_photo_review
                ,if(_photo_review.user_uid = ${req.headers['user_uid']}, 1, 0) my_review
                ,if(_like_count.count is null, 0, _like_count.count) as like_count
                ,if(_comment_count.count is null, 0, _comment_count.count) as comment_count
                ,_user.uid as user_uid
                ,_user.nickname as user_nickname
                ,_image_u.filename as user_profile
                ,_photo_review.uid as review_uid
                ,_photo_review.filename as review_filename
                ,_photo_review.filename as review_thumbnail
                ,_photo_review.content as review_content
                ,_photo_review.created_time as review_created_time
                ,0 as multiple_product
                ,json_object(
                    'product_uid', _product.uid, 'product_name', _product.name,
                    'product_thumbnail', _image_p.filename, 'seller_nickname', _seller.nickname,
                    'product_price_original', _product.price_original, 'product_price_discount', _product.price_discount,
                    'product_discount_rate', _product.discount_rate
                    )as product_info

            from tbl_photo_review as _photo_review

            inner join tbl_user as _user
                on _user.uid = _photo_review.user_uid

            inner join tbl_product as _product
                on _product.uid = _photo_review.product_uid

            inner join tbl_user as _seller
                on _seller.uid = _product.user_uid

            left join tbl_image as _image_u
                on _image_u.uid = (
                        select
                            tbl_image.uid
                        from tbl_image
                        where tbl_image.target_uid = _user.uid
                            and tbl_image.type = 1
                            and tbl_image.is_deleted = 0
                        limit 1
                    )

            left join tbl_image as _image_p
                on _image_p.uid = (
                        select
                            tbl_image.uid
                        from tbl_image
                        where tbl_image.target_uid = _product.uid
                            and tbl_image.type = 2
                            and tbl_image.is_deleted = 0
                        limit 1
                    )

            left join (
                select
                    count(_like.uid) as count
                    , _like.target_uid as review_uid
                from tbl_like as _like

                where _like.type = 5

                group by review_uid
                ) as _like_count
                on _like_count.review_uid = _photo_review.uid

            left join (
                select
                    count(_comment.uid) as count
                    , _comment.target_uid as review_uid
                from tbl_comment as _comment

                where _comment.type = 2

                group by review_uid
                ) as _comment_count
                on _comment_count.review_uid = _photo_review.uid
            where _photo_review.user_uid in (${req.paramBody['followList']})

                union all

            select
                0 as is_photo_review
                ,if(_video.user_uid = ${req.headers['user_uid']}, 1, 0) my_review
                ,if(_like_count.count is null, 0, _like_count.count) as like_count
                ,if(_comment_count.count is null, 0, _comment_count.count) as comment_count
                ,_user.uid as user_uid
                ,_user.nickname as user_nickname
                ,_image_u.filename as user_profile
                ,_video.uid as review_uid
                ,_video.filename as review_filename
                ,_image_v.filename as review_thumbnail
                ,_video.content as review_content
                ,_video.created_time as review_created_time
                ,if(_products.product_info is null, 0, 1)as multiple_product
                ,if(_products.product_info is null, json_object(
                    'product_uid', _product.uid, 'product_name', _product.name,
                    'product_thumbnail', _image_p.filename, 'seller_nickname', _seller.nickname,
                    'product_price_original', _product.price_original, 'product_price_discount', _product.price_discount,
                    'product_discount_rate', _product.discount_rate
                    ), _products.product_info) as product_info
            from tbl_video as _video

            inner join tbl_user as _user
            on _user.uid = _video.user_uid

            inner join tbl_product as _product
            on _product.uid = _video.product_uid

            inner join tbl_user as _seller
            on _seller.uid = _product.user_uid

            left join tbl_image as _image_p
            on _image_p.uid = (
                    select
                        tbl_image.uid
                    from tbl_image
                    where tbl_image.target_uid = _product.uid
                        and tbl_image.type = 2
                        and tbl_image.is_deleted = 0
                    limit 1
                )

            left join tbl_image as _image_u
            on _image_u.uid = (
                    select
                        tbl_image.uid
                    from tbl_image
                    where tbl_image.target_uid = _user.uid
                        and tbl_image.type = 1
                        and tbl_image.is_deleted = 0
                    limit 1
                )

            left join tbl_image as _image_v
            on _image_v.uid = (
                    select
                        tbl_image.uid
                    from tbl_image
                    where tbl_image.target_uid = _video.uid
                        and tbl_image.type = 10
                        and tbl_image.is_deleted = 0
                    limit 1
                )

            left join (
                select
                    count(_like.uid) as count
                    , _like.target_uid as review_uid
                from tbl_like as _like

                where _like.type = 2

                group by review_uid
            ) as _like_count
            on _like_count.review_uid = _video.uid

            left join (
                select
                    count(_comment.uid) as count
                    , _comment.target_uid as review_uid
                from tbl_comment as _comment

                where _comment.type = 1

                group by review_uid
            ) as _comment_count
            on _comment_count.review_uid = _video.uid

            left join (
                select
                    group_concat(json_object(
                    'product_uid', _product_sub.uid, 'product_name', _product_sub.name,
                    'product_thumbnail', _image_p_sub.filename, 'seller_nickname', _seller_sub.nickname,
                    'product_price_original', _product_sub.price_original, 'product_price_discount', _product_sub.price_discount,
                    'product_discount_rate', _product_sub.discount_rate
                    ) separator '@!@')as product_info
                    ,_video_product.video_uid as video_uid_sub
                from tbl_video_product as _video_product

                inner join tbl_product as _product_sub
                    on _product_sub.uid = _video_product.product_uid
                    and _product_sub.is_deleted = 0

                inner join tbl_user as _seller_sub
                    on _seller_sub.uid = _product_sub.user_uid

                left join tbl_image as _image_p_sub
                on _image_p_sub.uid = (
                        select
                            tbl_image.uid
                        from tbl_image
                        where tbl_image.target_uid = _product_sub.uid
                            and tbl_image.type = 2
                            and tbl_image.is_deleted = 0
                        limit 1
                    )

                group by _video_product.video_uid
            )as _products
            on _products.video_uid_sub = _video.uid

            where _video.user_uid in(${req.paramBody['followList']})
        )
        order by review_created_time
        limit 12 offset ${req.paramBody['offset']}
        ;
        
    `
    
    return await new Promise((resolve, reject)=>{
        db_connection.query(query,(err, rows, field)=>{
            if(err){
                const date = new Date(Date.now())

                reject(new Error(err.message+=`follow feed list 에서 에러 난 것 ${date}` || 'db error'))
            }
            resolve(rows)
        });
    }).catch(err => {throw err})

}

function feedListParse(feedList) {
    return feedList.map(item=>{
        const result = {
            ...item
        }
        if(item.multiple_product == 1){
            result['product_info'] = item.product_info.split('@!@').map(el => JSON.parse(el))
        }
        else{
            result['product_info'] = [JSON.parse(item.product_info)]
        }
        
        return result
    })
}