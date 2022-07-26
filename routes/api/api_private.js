/**
 * Created by hyunhunhwang on 2021. 01. 21.
 */
const express = require('express');
const app = express();


/**
 * user api
 */
app.route('/user').put( require('./user/updateUser') )
                  .delete( require('./user/deleteUser') )
// app.route('/user/profile/review/list').put( require('./user/selectUserProfileReviewList') )

app.route('/user/info/me').get( require('./user/selectUserInfoMe') )
app.route('/user/info/me/fcm').get( require('./user/selectFcmInfoMe'))
app.route('/user/info/other').get( require('./user/selectUserInfoOther') )
app.route('/user/profile/review/list').get( require('./user/selectUserProfileReviewList') )
app.route('/user/profile/list').get( require('./user/selectUserProfileList') )// 새 리뷰 리스트. 상품,영상,리뷰가 전부 나온다.
app.route('/user/profile/photo/list').get( require('./user/selectUserProfileReviewPhotoList') )// 새 리뷰 리스트. 상품, 리뷰만 나온다.
app.route('/user/profile/video/list').get( require('./user/selectUserProfileReviewVideoList') )// 새 리뷰 리스트. 영상, 리뷰만 나온다.

/**
 * product api
 */
app.route('/product/category/list').get(require('./product/selectProductCategoryList')) //220601부터 카테고리탭 생성됨

app.route('/product/confirm/list').get( require('./product/selectProductConfirmList') )
app.route('/product').get(require('./product/selectProductItem')) //상품 item만 불러온다.
app.route('/product/detail').get( require('./product/selectProductDetail') )
app.route('/product/detail/review/list').get( require('./product/selectProductDetailReviewList') )//2022/07/06 리뷰 영상, 사진, 카운트 같이 불러오기
app.route('/product/feed/list').get( require('./product/selectProductFeedList') )
app.route('/product/review/list').get( require('./product/selectProductReviewList') )
app.route('/product/option/list').get( require('./product/selectProductOptionList') )
app.route('/product/video/list').get( require('./product/selectProductVideoList') )
app.route('/product/recent/viewed')
    .put(require('./product/updateProductRecentViewed'))
    .get( require('./product/selectProductRecentViewedList') )
    .delete( require('./product/deleteProductRecentViewedList') )

app.route('/product/name/list').get( require('./product/selectProductNameList'))


/**
 * cart api
 */
app.route('/cart').post( require('./cart/createCart') )
    .delete( require('./cart/deleteCart') )
app.route('/cart/list').get( require('./cart/selectCartList') )

/**
 * order api
 */
app.route('/order').post( require('./order/createOrder') )
app.route('/order/list').get( require('./order/selectOrderList') )
app.route('/order/cancel/list').get( require('./order/selectOrderCancelList') )
app.route('/order/detail').get( require('./order/selectOrderDetail') )
// app.route('/order/confirm').put( require('./order/updateOrderConfirm') )
app.route('/order/status').put(require('../middleware/bootPay'), require('./order/updateOrderStatus') )

/**
 * reward api
 */
app.route('/reward').post( require('./reward/createReward') )
    .get( require('./reward/selectReward') )
app.route('/reward/accountBook').post( require('./reward/createRewardAccountBook') )
    .put( require('./reward/updateRewardAccountBook'))
app.route('/reward/history/list').get( require('./reward/selectRewardHistoryList') )
app.route('/reward/history/detail/list').get( require('./reward/selectRewardHistoryDetailList') )
app.route('/reward/history/status/list').get( require('./reward/selectRewardHistoryStatusList') )

app.route('/refund/info').get( require('./reward/selectRefundInfo') )
/**
 * point api
 */
app.route('/point')
    // .post( require('./point/createPoint') )
    .get( require('./point/selectPoint') )
app.route('/point/list').get( require('./point/selectPointList') )

/**
 * feed api
 */
app.route('/feed/list').get( require('./feed/selectFeedList') )
app.route('/feed/list/m3u8').get( require('./feed/selectFeedList_m3u8') )

/**
 * weggleDeal api
 */
app.route('/weggledeal/list').get( require('./weggleDeal/selectWeggleDealList') )

/**
 * video api
 */
app.route('/video/info').get( require('./video/selectVideoInfo') )
app.route('/video/count/shared').put( require('./video/updateVideoCountShared') )
app.route('/video/count/view').put( require('./video/updateVideoCountView') )
app.route('/video/review')
    .post( require('./video/createVideoReview') )
    .delete( require('./video/deleteVideoReview') )
app.route('/video/content').put( require('./video/updateVideoContent') )
app.route('/video/hashtag/list').get( require('./video/selectVideoHashTagList') )
app.route('/video/search/result/list').get( require('./video/selectVideoSearchResult') )

/**
 * review api
 */
 app.route('/review/photo').get( require('./review/selectPhotoReview'))
 app.route('/v1/review/photo').put( require('./review/updatePhotoReview'))
 app.route('/v1/review/photo').delete( require('./review/deletePhotoReview'))
 app.route('/review/photo').post( require('./review/createPhotoReview'))
 app.route('/review/video').get( require('./review/selectVideoReview'))

/**
 * comment api
 */
app.route('/comment')
    .post( require('./comment/createComment') )
    .delete( require('./comment/deleteComment') )

app.route('/comment/nested')
    .post( require('./comment/createNestedComment') )
    .delete( require('./comment/deleteNestedComment') )

app.route('/comment/list').get( require('./comment/selectCommentList') )
app.route('/comment/nested/list').get( require('./comment/selectNestedCommentList') )

/**
 * like api
 */
app.route('/like').put( require('./like/updateLike') )
app.route('/like/product/list').get( require('./like/selectLikeProductList') )
app.route('/like/video/list').get( require('./like/selectLikeVideoList') )

/**
 * addressbook api
 */
app.route('/addressbook')
    .post( require('./addressBook/createAddressBook') )
    .put( require('./addressBook/updateAddressBook') )
    .delete( require('./addressBook/deleteAddressBook') )
app.route('/addressbook/list').get( require('./addressBook/selectAddressBookList') )
app.route('/addressbook/detail').get( require('./addressBook/selectAddressBookDetail') )


/**
 * qna api
 */
app.route('/qna')
    .post( require('./qna/createQnA') )
    .put( require('./qna/updateQnA') )
    .delete( require('./qna/deleteQnA') )
app.route('/qna/list').get( require('./qna/selectQnAList') )
app.route('/qna/list/me').get( require('./qna/selectQnAListMe') )

/**
 * report api
 */
app.route('/report').post( require('./report/createReport') )



/**
 * etc api
 */
// app.route('/private/shared/count/plus').put( require('./video/updateSharedCount') )

/**
 * follow api
 */
app.route('/follow')
    .delete( require('./follow/deleteFollow') )
    .post( require('./follow/createFollow') )
app.route('/follow/list').get( require('./follow/selectFollowList') )
app.route('/follow/find/list').get( require('./follow/selectFollowFindList') )

/**
 * searchView api
 */
app.route('/searchview/list/all').get(require('./searchView/selectSerchViewListAll')) // 모아보기 모든 정보 불러오기
app.route('/v1/searchview/list/all').get(require('./searchView/v1SelectSerchViewListAll')) // 모아보기 모든 정보 불러오기
app.route('/v1/searchview/list/gongudeal').get(require('./searchView/v1SelectSerchViewListGonguDeal')) // 공구딜 전체보기
app.route('/v1/searchview/list/gongudeadline').get(require('./searchView/v1SelectSerchViewListGonguDeadline')) // 공구 마감임박 전체보기
app.route('/searchview/popular/category/product/preview/list').get( require('./searchView/selectSearchViewPopularCategoryProductList')) // 인기 카테고리 목록
app.route('/searchview/new/category/video/list').get( require('./searchView/selectSearchViewNewCategoryVideoList') )// 신규 카테고리 영상 목록

app.route('/searchview/search/list').get( require('./searchView/selectSearchViewSearchList') ) // 영상검색정보
app.route('/searchview/search/list/hashtag').get( require('./searchView/selectSearchViewHashTagSearchList') ) // 태그검색정보
app.route('/searchview/search/list/user').get( require('./searchView/selectSearchViewUserSearchList') ) // 사용자검색정보
app.route('/searchview/recommend/list').get( require('./searchView/selectSearchViewRecommendList') )// 추천상품검색정보

app.route('/searchview/ad/list').get( require('./searchView/selectSearchViewAdList') ) // 광고이미지 목록
app.route('/searchview/weggledeal/video/list').get( require('./searchView/selectSearchViewWeggledealVideoList') ); // 위글딜영상 목록
app.route('/searchview/new/product/list').get( require('./searchView/selectSearchViewNewProductList') ); // 신규상품 목록
app.route('/searchview/new/review/list').get( require('./searchView/selectSearchViewNewReviewList') ); // 신규리뷰 목록


// 모아보기 api legacy
// 앱 초창기 모아보기 리스트
app.route('/searchview').get( require('./searchView/selectSearchViewInfo') ) // 검색화면 모든정보
// app.route('/searchview/search/list').get( require('./video/selectSearchViewSearchList') ) // 이전 검색리스트

// 모아보기 api legacy
// app_version1.5.4, app_code73
app.route('/searchview/new/product/preview/list').get( require('./searchView/selectSearchViewNewProductPreviewList') ); // 신규상품 미리보기
app.route('/searchview/new/review/preview/list').get( require('./searchView/selectSearchViewNewReviewPreviewList') ); // 신규리뷰 미리보기
app.route('/searchview/weggledeal/preview/list').get( require('./searchView/selectSearchViewWeggledealPreviewList') ); // 위글딜 미리보기
app.route('/searchview/hot/weggler/list').get( require('./searchView/selectSearchViewHotWegglerlist') ) // 핫위글러 목록
app.route('/searchview/best/review/list').get( require('./searchView/selectSearchViewBestReviewList') ); // 베스트 리뷰 목록
// app.route('/searchview/new/review/list').get( require('./searchView/selectSearchViewNewReviewList') );


/**
 * notice api
 */
app.route('/notice/list').get( require('./notice/selectNoticeViewList') )

/**
 * gift api
 */
app.route('/gift/order').post( require('./gift/createGiftOrder') )
                              .put( require('./gift/updateGiftOrder'))
                              .get(require('./gift/selectGiftOrder'));
app.route('/gift/refuse').put(require('../middleware/bootPay'), require('./gift/updateGiftRefuse') );
app.route('/gift/refund').put(require('../middleware/bootPay'), require('./gift/updateGiftRefund') );

/**
 * Alert
 */
app.route('/alert/history/list').get( require('./alert/selectAlertHistoryList')) //알람 히스토리 리스트 불러오기
app.route('/alert/list').get( require('./alert/selectAlertList')) //알림차단 리스트 불러오기
app.route('/alert').put(require('./alert/updateAlertState')) //알림 차단 api

// 알람차단 api legacy
// app_version1.5.4, app_code73
app.route('/alert/review/video').put(require('./alert/version_legacy73/updateAlertReviewVideo')) //리뷰비디오알림 수정
app.route('/alert/order/confirm').put(require('./alert/version_legacy73/updateAlertOrderConfirm')) //주문확정알림 수정
app.route('/alert/order/confirm/request').put(require('./alert/version_legacy73/updateAlertOrderConfirmRequest')) //주문확정요청알림 수정
app.route('/alert/comment').put(require('./alert/version_legacy73/updateAlertComment')) //댓글알림수정
app.route('/alert/nested/comment').put(require('./alert/version_legacy73/updateNestedComment')) //대댓글알림수정
app.route('/alert/product/qna').put(require('./alert/version_legacy73/updateProductQna')) //문의알림수정

/**
 * Block
 */
app.route('/block').post( require('./block/createBlock')) //차단하기(영상, 댓글, 대댓글)
app.route('/block/user/list').get( require('./block/selectBlockUserList')) //차단 유저 목록 리스트
app.route('/block/user').put( require('./block/updateBlockUser')) //유저 차단 해제

/**
 * promotion
 */
app.route('/promotion/list/all').get( require('./promotion/selectPromotionPreviewList')) //모든 프로모션 화면 미리보기
app.route('/promotion/list').get( require('./promotion/selectPromotionList')) //프로모션 더보기

/**
 *  dev
 */
app.route('/dev/searchview/new/product/list').get( require('./_dev/_dev_selectSearchViewNewProductList'))

/**
 * dev groupbuying api
 */
app.route('/groupbuying').post( require('./groupBuying/createGroupBuying') )
app.route('/groupbuying/room').post( require('./groupBuying/createGroupBuyingRoom') )
app.route('/groupbuying/room/user').post( require('./groupBuying/createGroupBuyingRoomUser') )

app.route('/v1/groupbuying/detail/room').get( require('./groupBuying/v1SelectGroupBuyingRoom') )
app.route('/v1/groupbuying/detail').get( require('./groupBuying/v1SelectGroupBuyingDetailView') )
app.route('/v1/groupbuying/detail/room/list').get( require('./groupBuying/v1SelectGroupBuyingRoomList') )
module.exports = app;
