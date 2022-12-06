/**
 * Created by hyunhunhwang on 2021. 01. 21.
 */
const express = require('express');
const app = express();

/**
 * user api
 */
// app.route('/user/signup').post( require('./user/createUser') ) // 안쓰는것 22. 11. 04

app.route('/user/signup/check').get( require('./user/selectSignUpCheck') )
app.route('/user/email/check').get( require('./user/selectUserEmailCheck') )
app.route('/user/nickname/check').get( require('./user/selectUserNicknameCheck') )
app.route('/user/phone/check').get( require('./user/selectUserPhoneCheck') )
app.route('/user/recommendee/code/check').get( require('./user/selectUserRecommendeeCodeCheck') )
app.route('/user/profile/list').get(  require('./user/selectUserProfileList') )// 새 리뷰 리스트. 상품,영상,리뷰가 전부 나온다.
app.route('/user/info/other').get( require('./user/selectUserInfoOther') )
app.route('/user/profile/photo/list').get(  require('./user/selectUserProfileReviewPhotoList') )// 새 리뷰 리스트. 상품, 리뷰만 나온다.
app.route('/user/profile/video/list').get(  require('./user/selectUserProfileReviewVideoList') )// 새 리뷰 리스트. 영상, 리뷰만 나온다.
app.route('/user/signup').post( require('./user/createUser') )
app.route('/v2/user/info/other').get(  require('./user/v2SelectUserInfoOther') )
app.route('/v2/user/signup').post( require('./user/v2CreateUser') ) // 22. 10. 25 v2 유저생성 api
app.route('/v2/user/interests/all').get(  require('./user/v2SelectUserInterests') ) // 22. 10. 25 v2 관심키워드 모두 가져오기 api
app.route('/v2/user/info/review').get( require('./user/v2SelectUserInfoReview') ) // 22. 10. 28 v2 유저 페이지 리뷰 리스트 api

/**
 * file api
 */
app.route('/file').post( require('../../common/utils/awsS3Util_v2').uploadFile, require('./file/uploadFile') );
app.route('/file/m3u8').post( require('../../common/utils/awsS3Util_v2_m3u8').uploadFile, require('./file/uploadFile_m3u8') );

/**
 * cron order_cancel_gift
 */
app.route('/order/cancel/gift').put(require('../middleware/bootPay'), require('../api/gift/updateGiftRefund') );
/**
 * bootpay error all cancel
 */
app.route('/order/cancel').put(require('../middleware/bootPayErrorCancel'))


/**
 * app version check
 */
app.route('/app/version/check').get(require('./appCheck/selectAppCheck'))

/**
 * comment api
 */
 app.route('/v2/comment/list').get( require('./comment/v2SelectCommentList'))

/**
 * product api
 */
app.route('/product/review/list').get(  require('./product/selectProductReviewList') )
app.route('/product/category/list').get( require('./product/selectProductCategoryList')) //220601부터 카테고리탭 생성됨
app.route('/product/detail').get( require('./product/selectProductDetail') )
app.route('/product/option/list').get(  require('./product/selectProductOptionList') )
app.route('/product/detail/review/list').get(  require('./product/selectProductDetailReviewList') )//2022/07/06 리뷰 영상, 사진, 카운트 같이 불러오기
app.route('/product/name/list').get(  require('./product/selectProductNameList'))
app.route('/v2/product/search/list').get( require('./product/v2SelectProductSearchList') )

/**
 * dev api
 */
app.route('/dev/searchview/new/review/list').get( require('./_dev/_dev_selectSearchViewNewReviewList') )
app.route('/dev/video/product').get( require('./_dev/_dev_insertVideoProduct') )
// app.route('/dev/test').get( require('./_dev/_dev_select') ) // 안쓰는것 22. 11. 04
// app.route('/dev/change/mp4/to/hls').put( require('./_dev/_dev_update_change_MP4_to_HLS') ) // 안쓰는것 22. 11. 04
// app.route('/dev/change/mp4/to/hls').get( require('./_dev/_dev_select_change_MP4_to_HLS') ) // 안쓰는것 22. 11. 04
// app.route('/dev/accesstoken').put( require('./_dev/_dev_updateAccessToken') ) // 안쓰는것 22. 11. 04
// app.route('/dev/update/reward/product/amount').put( require('./_dev/_dev_updateRewardProductAmount') ) // 안쓰는것 22. 11. 04
// app.route('/user/auto/recommend').get( require('./user/autoRecommend') ) // 안쓰는것 22. 11. 04


/**
 * feed api(public)
 */
app.route('/feed/list').get( require('./feed/v1SelectFeedList'))
app.route('/v1/feed/list').get( require('./feed/v1SelectFeedList') )
app.route('/v1/feed/product/list').get( require('./feed/v1SelectFeedProductList') )
app.route('/v2/feed/review/list').get( require('./feed/v2SelectFeedReviewList') )
// app.route('/test/feed/list').get( ,require('./feed/v1SelectFeedList')) // 추후에 미들웨어 app에서 넣어주는걸로
// app.route('/v1/gongu/feed/list').get( require('./feed/public_v1SelectGonguFeedList') )
// app.route('/feed/list/m3u8').get( require('./feed/public_selectFeedList_m3u8') )

/**
 * video api
 */
app.route('/video/info').get( require('./video/selectVideoInfo') )
app.route('/video/count/shared').put( require('./video/updateVideoCountShared') )
app.route('/video/count/view').put( require('./video/updateVideoCountView') )
app.route('/video/count/view').put( require('./video/updateVideoCountView') )
app.route('/video/hashtag/list').get( require('./video/selectVideoHashTagList') )

/**
 * searchview api
 */
app.route('/searchview/search/list').get(  require('./searchView/selectSearchViewSearchList') ) // 영상검색정보
app.route('/searchview/search/list/hashtag').get(  require('./searchView/selectSearchViewHashTagSearchList') ) // 태그검색정보
app.route('/searchview/search/list/user').get(  require('./searchView/selectSearchViewUserSearchList') ) // 사용자검색정보
app.route('/v1/searchview/list/all').get( require('./searchView/v1SelectSerchViewListAll')) // 모아보기 모든 정보 불러오기
app.route('/v1/searchview/list/gongudeal').get( require('./searchView/v1SelectSerchViewListGonguDeal')) // 공구딜 전체보기
app.route('/v1/searchview/list/gongudeadline').get( require('./searchView/v1SelectSerchViewListGonguDeadline')) // 공구 마감임박 전체보기

app.route('/v2/searchview/list/all').get(require('../middleware/publicCheckToken'), require('./searchView/v2SelectSerchViewListAll')) // 모아보기 모든 정보 불러오기
app.route('/v2/searchview/price/range/list').get(require('../middleware/publicCheckToken'), require('./searchView/v2SelectSearchViewPriceRangeList'))//가격범위불러오기



/**
 * comment api
 */
app.route('/comment/list').get( require('./comment/selectCommentList') )

/**
 * promotion api
 */
app.route('/promotion/list/all').get( require('./promotion/selectPromotionPreviewList')) //모든 프로모션 화면 미리보기
app.route('/promotion/list').get(  require('./promotion/selectPromotionList')) //프로모션 더보기

/**
 * follow api
 */
app.route('/follow/list').get(  require('./follow/selectFollowList') )
app.route('/v1/follow/list').get(  require('./follow/v1SelectFollowList') )
app.route('/v1/follower/list').get(  require('./follow/v1SelectFollowerList') )
app.route('/v1/follow/search/list').get( require('./follow/v1SelectFollowSearchList') )
app.route('/v1/follower/search/list').get(  require('./follow/v1SelectFollowerSearchList') )

/**
 * review api
 */
app.route('/review/photo').get(  require('./review/selectPhotoReview'))
app.route('/review/video').get(  require('./review/selectVideoReview'))

/**
 * groupbuying api
 */
app.route('/v1/groupbuying/detail').get(  require('./groupBuying/v1SelectGroupBuyingDetailView') )
app.route('/v1/groupbuying/detail/room/list').get(  require('./groupBuying/v1SelectGroupBuyingRoomList') )

module.exports = app;