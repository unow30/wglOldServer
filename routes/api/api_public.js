/**
 * Created by hyunhunhwang on 2021. 01. 21.
 */
const express = require('express');
const app = express();

/**
 * user api
 */
app.route('/user/signup').post( require('./user/createUser') )
app.route('/v2/user/signup').post(require('../middleware/publicCheckToken'), require('./user/v2CreateUser') ) // 22. 10. 25 v2 유저생성 api
app.route('/v2/user/interests/all').get(require('../middleware/publicCheckToken'),  require('./user/v2SelectUserInterests') ) // 22. 10. 25 v2 관심키워드 모두 가져오기 api
app.route('/user/signup/check').get( require('./user/selectSignUpCheck') )
app.route('/user/email/check').get( require('./user/selectUserEmailCheck') )
app.route('/user/nickname/check').get( require('./user/selectUserNicknameCheck') )
app.route('/user/phone/check').get( require('./user/selectUserPhoneCheck') )
app.route('/user/recommendee/code/check').get( require('./user/selectUserRecommendeeCodeCheck') )

/**
 * file api
 */
app.route('/file').post( require('../../common/utils/awsS3Util_v2').uploadFile, require('./file/uploadFile') );
app.route('/file/m3u8').post( require('../../common/utils/awsS3Util_v2_m3u8').uploadFile, require('./file/uploadFile_m3u8') );
// app.route('/public/image').post( require('../../common/utils/awsS3Util_v2').uploadImage, require('./file/uploadFile') );
// app.route('/public/video').post( require('../../common/utils/awsS3Util_v2').uploadVideo, require('./file/uploadFile') );

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
 * dev api
 */
app.route('/dev/test').get( require('./_dev/_dev_select') )
app.route('/dev/change/mp4/to/hls').put( require('./_dev/_dev_update_change_MP4_to_HLS') )
app.route('/dev/change/mp4/to/hls').get( require('./_dev/_dev_select_change_MP4_to_HLS') )
app.route('/dev/searchview/new/review/list').get( require('./_dev/_dev_selectSearchViewNewReviewList') )
app.route('/dev/accesstoken').put( require('./_dev/_dev_updateAccessToken') )

app.route('/user/auto/recommend').get( require('./user/autoRecommend') )


/**
 * feed api(public)
 */
app.route('/test/feed/list').get( require('../middleware/publicCheckToken') ,require('./feed/v1SelectFeedList')) // 추후에 미들웨어 app에서 넣어주는걸로
// app.route('/v1/gongu/feed/list').get( require('./feed/public_v1SelectGonguFeedList') )
// app.route('/feed/list/m3u8').get( require('./feed/public_selectFeedList_m3u8') )


/* 임시 안드로이드용 라우터 */
app.route('/test/feed/list').get( require('../middleware/publicCheckToken') ,require('./feed/v1SelectFeedList')) // 추후에 미들웨어 app에서 넣어주는걸로
app.route('/test/user/signup').post(require('../middleware/publicCheckToken'), require('./user/createUser') )
app.route('/test/user/signup/check').get(require('../middleware/publicCheckToken'), require('./user/selectSignUpCheck') )
app.route('/test/user/email/check').get(require('../middleware/publicCheckToken'), require('./user/selectUserEmailCheck') )
app.route('/test/user/nickname/check').get(require('../middleware/publicCheckToken'), require('./user/selectUserNicknameCheck') )
app.route('/test/user/phone/check').get(require('../middleware/publicCheckToken'), require('./user/selectUserPhoneCheck') )
app.route('/test/user/recommendee/code/check').get(require('../middleware/publicCheckToken'), require('./user/selectUserRecommendeeCodeCheck') )
app.route('/test/video/count/view').put(require('../middleware/publicCheckToken'), require('./video/updateVideoCountView') )
app.route('/test/comment/list').get(require('../middleware/publicCheckToken'), require('./comment/selectCommentList') )
app.route('/test/video/info').get(require('../middleware/publicCheckToken'), require('./video/selectVideoInfo') )
app.route('/test/product/detail').get(require('../middleware/publicCheckToken'), require('./product/selectProductDetail') )
app.route('/test/user/info/other').get(require('../middleware/publicCheckToken'), require('./user/selectUserInfoOther') )
app.route('/test/product/category/list').get(require('../middleware/publicCheckToken'), require('./product/selectProductCategoryList')) //220601부터 카테고리탭 생성됨
app.route('/test/v1/searchview/list/all').get(require('../middleware/publicCheckToken'), require('./searchView/v1SelectSerchViewListAll')) // 모아보기 모든 정보 불러오기
app.route('/test/promotion/list/all').get(require('../middleware/publicCheckToken'), require('./promotion/selectPromotionPreviewList')) //모든 프로모션 화면 미리보기
app.route('/test/video/count/shared').put(require('../middleware/publicCheckToken'), require('./video/updateVideoCountShared') )
app.route('/test/video/count/view').put(require('../middleware/publicCheckToken'), require('./video/updateVideoCountView') )

app.route('/test/follow/list').get( require('../middleware/publicCheckToken'), require('./follow/selectFollowList') )
app.route('/test/v1/follow/list').get( require('../middleware/publicCheckToken'), require('./follow/v1SelectFollowList') )
app.route('/test/v1/follower/list').get( require('../middleware/publicCheckToken'), require('./follow/v1SelectFollowerList') )

app.route('/test/product/option/list').get(require('../middleware/publicCheckToken'),  require('./product/selectProductOptionList') )
app.route('/test/product/detail/review/list').get(require('../middleware/publicCheckToken'),  require('./product/selectProductDetailReviewList') )//2022/07/06 리뷰 영상, 사진, 카운트 같이 불러오기
app.route('/test/user/profile/photo/list').get(require('../middleware/publicCheckToken'),  require('./user/selectUserProfileReviewPhotoList') )// 새 리뷰 리스트. 상품, 리뷰만 나온다.
app.route('/test/user/profile/video/list').get(require('../middleware/publicCheckToken'),  require('./user/selectUserProfileReviewVideoList') )// 새 리뷰 리스트. 영상, 리뷰만 나온다.
app.route('/test/promotion/list').get(require('../middleware/publicCheckToken'),  require('./promotion/selectPromotionList')) //프로모션 더보기
app.route('/test/v1/searchview/list/gongudeal').get(require('../middleware/publicCheckToken'), require('./searchView/v1SelectSerchViewListGonguDeal')) // 공구딜 전체보기
app.route('/test/v1/searchview/list/gongudeadline').get(require('../middleware/publicCheckToken'), require('./searchView/v1SelectSerchViewListGonguDeadline')) // 공구 마감임박 전체보기

app.route('/test/v1/groupbuying/detail').get(require('../middleware/publicCheckToken'),  require('./groupBuying/v1SelectGroupBuyingDetailView') )
app.route('/test/product/name/list').get(require('../middleware/publicCheckToken'),  require('./product/selectProductNameList'))
app.route('/test/review/photo').get(require('../middleware/publicCheckToken'),  require('./review/selectPhotoReview'))
app.route('/test/review/video').get(require('../middleware/publicCheckToken'),  require('./review/selectVideoReview'))
app.route('/test/v2/user/info/other').get(require('../middleware/publicCheckToken'),  require('./user/v2SelectUserInfoOther') )

app.route('/test/v1/follower/search/list').get(require('../middleware/publicCheckToken'),  require('./follow/v1SelectFollowerSearchList') )
app.route('/test/user/profile/list').get(require('../middleware/publicCheckToken'),  require('./user/selectUserProfileList') )// 새 리뷰 리스트. 상품,영상,리뷰가 전부 나온다.

app.route('/test/searchview/search/list/hashtag').get(require('../middleware/publicCheckToken'),  require('./searchView/selectSearchViewHashTagSearchList') ) // 태그검색정보
app.route('/test/searchview/search/list/user').get(require('../middleware/publicCheckToken'),  require('./searchView/selectSearchViewUserSearchList') ) // 사용자검색정보
app.route('/test/searchview/search/list').get(require('../middleware/publicCheckToken'),  require('./searchView/selectSearchViewSearchList') ) // 영상검색정보
app.route('/test/product/review/list').get(require('../middleware/publicCheckToken'),  require('./product/selectProductReviewList') )
app.route('/test/v1/groupbuying/detail/room/list').get(require('../middleware/publicCheckToken'),  require('./groupBuying/v1SelectGroupBuyingRoomList') )

app.route('/test/v1/feed/product/list').get(require('../middleware/publicCheckToken'), require('./feed/v1SelectFeedProductList') )

module.exports = app;