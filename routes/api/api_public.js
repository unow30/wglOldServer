/**
 * Created by hyunhunhwang on 2021. 01. 21.
 */
const express = require("express");
const app = express();

/**
 * user api
 */
// app.route('/user/signup').post( require('./user/createUser') ) // 안쓰는것 22. 11. 04

app
  .route("/user/signup/check")
  .get(require("./legacy/origin/user/selectSignUpCheck"));
app
  .route("/user/email/check")
  .get(require("./legacy/origin/user/selectUserEmailCheck"));
app
  .route("/user/nickname/check")
  .get(require("./legacy/origin/user/selectUserNicknameCheck"));
app
  .route("/user/phone/check")
  .get(require("./legacy/origin/user/selectUserPhoneCheck"));
app
  .route("/user/recommendee/code/check")
  .get(require("./legacy/origin/user/selectUserRecommendeeCodeCheck"));
app
  .route("/user/profile/list")
  .get(require("./legacy/origin/user/selectUserProfileList")); // 새 리뷰 리스트. 상품,영상,리뷰가 전부 나온다.
app
  .route("/user/info/other")
  .get(require("./legacy/origin/user/selectUserInfoOther"));
app
  .route("/user/profile/photo/list")
  .get(require("./legacy/origin/user/selectUserProfileReviewPhotoList")); // 새 리뷰 리스트. 상품, 리뷰만 나온다.
app
  .route("/user/profile/video/list")
  .get(require("./legacy/origin/user/selectUserProfileReviewVideoList")); // 새 리뷰 리스트. 영상, 리뷰만 나온다.
app.route("/user/signup").post(require("./legacy/origin/user/createUser"));
app
  .route("/v2/user/info/other")
  .get(require("./legacy/v2/user/v2SelectUserInfoOther"));
app.route("/v2/user/signup").post(require("./legacy/v2/user/v2CreateUser")); // 22. 10. 25 v2 유저생성 api
app
  .route("/v2/user/interests/all")
  .get(require("./legacy/v2/user/v2SelectUserInterests")); // 22. 10. 25 v2 관심키워드 모두 가져오기 api
app
  .route("/v2/user/info/review")
  .get(require("./legacy/v2/user/v2SelectUserInfoReview")); // 22. 10. 28 v2 유저 페이지 리뷰 리스트 api
app
  .route("/v2/user/info/product")
  .get(require("./legacy/v2/user/v2SelectProfileProduct")); // 23. 01. 09 유저 페이지 판매상품 리스트 api
/**
 * file api
 */
app
  .route("/file")
  .post(
    require("../../common/utils/legacy/v2/awsS3Util_v2").uploadFile,
    require("./legacy/origin/file/uploadFile"),
  );
app
  .route("/file/m3u8")
  .post(
    require("../../common/utils/legacy/v2/awsS3Util_v2_m3u8").uploadFile,
    require("./legacy/origin/file/uploadFile_m3u8"),
  );
app
  .route("/v3/file/m3u8")
  .post(
    require("../../common/utils/legacy/v2/awsS3Util_v2_m3u8").uploadFile,
    require("./v3/file/uploadFile_m3u8_v3"),
  );

/**
 * cron order_cancel_gift
 */
app
  .route("/order/cancel/gift")
  .put(
    require("../middleware/legacy/origin/bootPay"),
    require("./legacy/origin/gift/updateGiftRefund"),
  );
/**
 * bootpay error all cancel
 */
app
  .route("/order/cancel")
  .put(require("../middleware/legacy/origin/bootPayErrorCancel"));

/**
 * app version check
 */
app
  .route("/app/version/check")
  .get(require("./legacy/origin/appCheck/selectAppCheck"));

/**
 * comment api
 */
app
  .route("/v2/comment/list")
  .get(require("./legacy/v2/comment/v2SelectCommentList"));

/**
 * product api
 */
app
  .route("/product/review/list")
  .get(require("./legacy/origin/product/selectProductReviewList"));
app
  .route("/product/category/list")
  .get(require("./legacy/origin/product/selectProductCategoryList")); //220601부터 카테고리탭 생성됨
app
  .route("/product/detail")
  .get(require("./legacy/origin/product/selectProductDetail"));
app
  .route("/product/option/list")
  .get(require("./legacy/origin/product/selectProductOptionList"));
app
  .route("/product/detail/review/list")
  .get(require("./legacy/origin/product/selectProductDetailReviewList")); //2022/07/06 리뷰 영상, 사진, 카운트 같이 불러오기
app
  .route("/product/name/list")
  .get(require("./legacy/origin/product/selectProductNameList"));
app
  .route("/v2/product/search/list")
  .get(require("./legacy/v2/product/v2SelectProductSearchList"));

/**
 * dev api
 */
app
  .route("/dev/searchview/new/review/list")
  .get(require("./_dev/_dev_selectSearchViewNewReviewList"));
app.route("/dev/video/product").get(require("./_dev/_dev_insertVideoProduct"));
// app.route('/dev/test').get( require('./_dev/_dev_select') ) // 안쓰는것 22. 11. 04
// app.route('/dev/change/mp4/to/hls').put( require('./_dev/_dev_update_change_MP4_to_HLS') ) // 안쓰는것 22. 11. 04
// app.route('/dev/change/mp4/to/hls').get( require('./_dev/_dev_select_change_MP4_to_HLS') ) // 안쓰는것 22. 11. 04
// app.route('/dev/accesstoken').put( require('./_dev/_dev_updateAccessToken') ) // 안쓰는것 22. 11. 04
// app.route('/dev/update/reward/product/amount').put( require('./_dev/_dev_updateRewardProductAmount') ) // 안쓰는것 22. 11. 04
// app.route('/user/auto/recommend').get( require('./user/autoRecommend') ) // 안쓰는것 22. 11. 04

/**
 * feed api(public)
 */
app.route("/feed/list").get(require("./legacy/v1/feed/v1SelectFeedList"));
app.route("/v1/feed/list").get(require("./legacy/v1/feed/v1SelectFeedList"));
app
  .route("/v1/feed/product/list")
  .get(require("./legacy/v1/feed/v1SelectFeedProductList"));
app
  .route("/v2/feed/review/list")
  .get(require("./legacy/v2/feed/v2SelectFeedReviewList"));
// app.route('/test/feed/list').get( ,require('./feed/v1SelectFeedList')) // 추후에 미들웨어 app에서 넣어주는걸로
// app.route('/v1/gongu/feed/list').get( require('./feed/public_v1SelectGonguFeedList') )
// app.route('/feed/list/m3u8').get( require('./feed/public_selectFeedList_m3u8') )
app.route("/v3/feed/list").get(require("./v3/feed/v3SelectFeedList"));

/**
 * video api
 */
app.route("/video/info").get(require("./legacy/origin/video/selectVideoInfo"));
app
  .route("/video/count/shared")
  .put(require("./legacy/origin/video/updateVideoCountShared"));
app
  .route("/video/count/view")
  .put(require("./legacy/origin/video/updateVideoCountView"));
app
  .route("/video/count/view")
  .put(require("./legacy/origin/video/updateVideoCountView"));
app
  .route("/video/hashtag/list")
  .get(require("./legacy/origin/video/selectVideoHashTagList"));

/**
 * searchview api
 */
app
  .route("/searchview/search/list")
  .get(require("./legacy/origin/searchView/selectSearchViewSearchList")); // 영상검색정보
app
  .route("/searchview/search/list/hashtag")
  .get(require("./legacy/origin/searchView/selectSearchViewHashTagSearchList")); // 태그검색정보
app
  .route("/searchview/search/list/user")
  .get(require("./legacy/origin/searchView/selectSearchViewUserSearchList")); // 사용자검색정보
app
  .route("/v1/searchview/list/all")
  .get(require("./legacy/v1/searchView/v1SelectSerchViewListAll")); // 모아보기 모든 정보 불러오기
app
  .route("/v1/searchview/list/gongudeal")
  .get(require("./legacy/v1/searchView/v1SelectSerchViewListGonguDeal")); // 공구딜 전체보기
app
  .route("/v1/searchview/list/gongudeadline")
  .get(require("./legacy/v1/searchView/v1SelectSerchViewListGonguDeadline")); // 공구 마감임박 전체보기

/**
 * v2Searchview api
 * 22년 12월 24일부터 적용
 */
app
  .route("/v2/searchview/list/all")
  .get(require("./legacy/v2/v2SearchView/v2SelectSerchViewListAll")); //모아보기 전체 탭 정보 불러오기
app
  .route("/v2/searchview/last/order/list")
  .get(require("./legacy/v2/v2SearchView/v2SelectSearchViewLastOrderList")); //마감임박 공구딜 더보기
app
  .route("/v2/searchview/participant/list")
  .get(require("./legacy/v2/v2SearchView/v2SelectSearchViewParticipantList")); //참여 가능한 공구방 더보기
app
  .route("/v2/searchview/promotion/list")
  .get(require("./legacy/v2/v2SearchView/v2SelectSearchViewPromotionList")); //브랜드관 더보기
app
  .route("/v2/searchview/price/range/list")
  .get(require("./legacy/v2/v2SearchView/v2SelectSearchViewPriceRangeList")); //가격대별 상품목록 더보기
app
  .route("/v2/searchview/new/review/list")
  .get(require("./legacy/v2/v2SearchView/v2SelectSearchViewNewReviewList")); // 신규리뷰 목록 더보기
app
  .route("/v2/searchview/gongu/feed/list")
  .get(require("./legacy/v2/v2SearchView/v2SelectSearchViewGonguFeedList")); //공구영상 더보기
app
  .route("/v2/searchview/best/product/list")
  .get(require("./legacy/v2/v2SearchView/v2SelectSearchViewBestProductList")); //인기상품 더보기
app
  .route("/v2/searchview/edition/list")
  .get(require("./legacy/v2/v2SearchView/v2SelectSearchViewEditionList")); //기획전 더보기
app
  .route("/v2/searchview/interest/list")
  .get(require("./legacy/v2/v2SearchView/v2SelectSearchViewInterestList")); //취향저격 더보기
app
  .route("/v2/searchview/delivery/free")
  .get(require("./legacy/v2/v2SearchView/v2SelectSearchViewDeliveryFreeList")); //배송무료 더보기
app
  .route("/v2/searchview/integerated/search/list")
  .get(
    require("./legacy/v2/v2SearchView/v2SelectSearchViewIntegratedSearchList"),
  ); //통합검색 결과

app
  .route("/v2/searchview/banner/event")
  .get(require("./legacy/v2/v2SearchView/v2SelectBannerEvent")); //이벤트 데이터 api

/**
 * v3Searchview api
 * 22년 12월 24일부터 적용
 */
app
  .route("/v3/searchview/banner/all")
  .get(require("./v3/searchView/v3SelectSearchViewBannerListAll")); //모아보기 배너 이미지 전체 불러오기(홈배너, 기획전배너)
app
  .route("/v3/searchview/brand/list/all")
  .get(require("./v3/searchView/v3SelectSearchViewBrandListAll")); //모아보기 브랜드관 탭 정보 불러오기

/**
 * comment api
 */
app
  .route("/comment/list")
  .get(require("./legacy/origin/comment/selectCommentList"));

/**
 * promotion api
 */
app
  .route("/promotion/list/all")
  .get(require("./legacy/origin/promotion/selectPromotionPreviewList")); //모든 프로모션 화면 미리보기
app
  .route("/promotion/list")
  .get(require("./legacy/origin/promotion/selectPromotionList")); //프로모션 더보기

/**
 * follow api
 */
app
  .route("/follow/list")
  .get(require("./legacy/origin/follow/selectFollowList"));
app
  .route("/v1/follow/list")
  .get(require("./legacy/v1/follow/v1SelectFollowList"));
app
  .route("/v1/follower/list")
  .get(require("./legacy/v1/follow/v1SelectFollowerList"));
app
  .route("/v1/follow/search/list")
  .get(require("./legacy/v1/follow/v1SelectFollowSearchList"));
app
  .route("/v1/follower/search/list")
  .get(require("./legacy/v1/follow/v1SelectFollowerSearchList"));

/**
 * review api
 */
app
  .route("/review/photo")
  .get(require("./legacy/origin/review/selectPhotoReview"));
app
  .route("/review/video")
  .get(require("./legacy/origin/review/selectVideoReview"));

/**
 * groupbuying api
 */
app
  .route("/v1/groupbuying/detail")
  .get(require("./legacy/v1/groupbuying/v1SelectGroupBuyingDetailView"));
app
  .route("/v1/groupbuying/detail/room/list")
  .get(require("./legacy/v1/groupbuying/v1SelectGroupBuyingRoomList"));

/**
 * challenge api
 */
app
  .route("/v2/challenge/recent/round")
  .get(require("./legacy/v2/challenge/v2SelectChallengeRecentRound"));

/**
 * category
 */
app
  .route("/v2/category/icon")
  .get(require("./legacy/origin/category/selectCategoryIcon")); //추후 v3로 api 변경
// app.route('/v3/category/icon').get(require('./legacy/origin/category/selectCategoryIcon')) //변경될 icon api
app
  .route("/product/category/list")
  .get(require("./legacy/origin/product/selectProductCategoryList")); //220601부터 카테고리탭 생성됨. 추후 v3로 api 변경
app
  .route("/v2/searchview/category/list")
  .get(require("./legacy/v2/v2SearchView/v2SelectCategoryProductList")); //카테고리 상품 리스트 세부카테고리 적용됨. 추후 v3로 변경
app
  .route("/v3/category/list")
  .get(require("./v3/category/v3SelectCategoryProductList")); //변경될 category/list api

module.exports = app;
