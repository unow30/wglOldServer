/**
 * Created by hyunhunhwang on 2021. 01. 21.
 */
const express = require('express');
const app = express();


/**
 * user api
 */
app.route('/v2/user').put( require('./legacy/v2/user/v2UpdateUser') )
app.route('/v3/user').put( require('./v3/user/v3UpdateUser') )
app.route('/user').put( require('./legacy/origin/user/updateUser') )
                  .delete( require('./legacy/origin/user/deleteUser') )
// app.route('/user/profile/review/list').put( require('./user/selectUserProfileReviewList') )

app.route('/v2/user/info/me').get( require('./legacy/v2/user/v2SelectUserInfoMe') )
app.route('/v2/user/reward/info').get( require('./legacy/v2/user/v2SelectUserRefundInfo') )
app.route('/v2/user/my/activity/comment').get( require('./legacy/v2/user/v2SelectUserMyActivityComment') )
app.route('/v2/user/my/activity/post').get( require('./legacy/v2/user/v2SelectUserMyActivityPost') )
app.route('/v2/user/my/activity/review/detail').get( require('./legacy/v2/user/v2SelectUserMyActivityReviewDetail') )

app.route('/user/info/me').get( require('./legacy/origin/user/selectUserInfoMe') )
app.route('/user/info/me/fcm').get( require('./legacy/origin/user/selectFcmInfoMe'))
app.route('/user/profile/review/list').get( require('./legacy/origin/user/selectUserProfileReviewList') )

/**
 * file api
 */
app.route('/v2/file/reward/info/image').post(require('../middleware/legacy/origin/rewardInfoImageUpload'), require('./legacy/v2/file/v2UploadRewardInfoImage'))
app.route('/v2/upload/files').post( require('../middleware/legacy/origin/s3MediaUpload'), require('./legacy/v2/file/v2UploadFileArray') );

/**
 * product api
 */

// app.route('/product/confirm/list').get( require('./product/selectProductConfirmList') ) // 비로그인 때 주석함 22. 10. 20
app.route('/v1/product/confirm/list').get( require('./legacy/v1/product/v1SelectProductConfirmList') )
app.route('/product').get(require('./legacy/origin/product/selectProductItem')) //상품 item만 불러온다.
app.route('/product/video/list').get( require('./legacy/origin/product/selectProductVideoList') )
app.route('/product/recent/viewed')
    .put(require('./legacy/origin/product/updateProductRecentViewed'))
    .get( require('./legacy/origin/product/selectProductRecentViewedList') )
    .delete( require('./legacy/origin/product/deleteProductRecentViewedList') )



/**
 * cart api
 */
app.route('/cart').post( require('./legacy/origin/cart/createCart') )
    .delete( require('./legacy/origin/cart/deleteCart') )
app.route('/cart/list').get( require('./legacy/origin/cart/selectCartList') )

/**
 * order api
 */
app.route('/order').post( require('./legacy/origin/order/createOrder'));
app.route('/v3/order').post(require('./v3/order/v3CreateOrder'));
app.route('/v3/order/gift').post(require('./v3/order/v3CreateGiftOrder'));
app.route('/v3/order/groupbuying').post(require('./v3/order/v3GroupbuyingOrder'));
// app.route('/v3/order/groupbuying').post(require('./legacy/v1/groupbuying/v1CreateGroupBuyingOrder'));

app.route('/order1').post( require('./legacy/origin/order/dev_createOrder1') )
app.route('/order2').post( require('./legacy/origin/order/dev_createOrder2') )
app.route('/order3').post( require('./legacy/origin/order/dev_createOrder3') )

app.route('/order/list').get( require('./legacy/origin/order/selectOrderList') )
app.route('/order/cancel/list').get( require('./legacy/origin/order/selectOrderCancelList') )
app.route('/order/detail').get( require('./legacy/origin/order/selectOrderDetail') )
// app.route('/order/confirm').put( require('./order/updateOrderConfirm') )
app.route('/order/status').put(require('../middleware/legacy/origin/bootPay'), require('./legacy/origin/order/updateOrderStatus') )

/**
 * reward api
 */
app.route('/reward').post( require('./legacy/origin/reward/createReward') )
    .get( require('./legacy/origin/reward/selectReward') )
app.route('/v2/reward').post( require('./legacy/v2/reward/v2CreateReward') )
app.route('/reward/accountBook').post( require('./legacy/origin/reward/createRewardAccountBook') )
    .put( require('./legacy/origin/reward/updateRewardAccountBook'))
app.route('/reward/history/list').get( require('./legacy/origin/reward/selectRewardHistoryList') )
app.route('/reward/history/detail/list').get( require('./legacy/origin/reward/selectRewardHistoryDetailList') )
app.route('/reward/history/status/list').get( require('./legacy/origin/reward/selectRewardHistoryStatusList') )

app.route('/refund/info').get( require('./legacy/origin/reward/selectRefundInfo') )
/**
 * point api
 */
app.route('/point')
    // .post( require('./point/createPoint') )
    .get( require('./legacy/origin/point/selectPoint') )
app.route('/point/list').get( require('./legacy/origin/point/selectPointList') )
app.route('/v2/point/history').get( require('./legacy/v2/point/v2SelectPointHistory') )


/**
 * feed api
 */
// app.route('/feed/list').get( require('./feed/selectFeedList') ) //22. 11. 08일 주석 처리 퍼블릭에서 사용해야함
// app.route('/v1/feed/list').get( require('./feed/v1SelectFeedList') ) //22. 11. 08일 주석 처리 퍼블릭에서 사용해야함
app.route('/v1/gongu/feed/list').get( require('./legacy/v1/feed/v1SelectGonguFeedList') )
app.route('/feed/list/m3u8').get( require('./legacy/origin/feed/selectFeedList_m3u8') )

/**
 * weggleDeal api
 */
app.route('/weggledeal/list').get( require('./legacy/origin/weggleDeal/selectWeggleDealList') )

/**
 * video api
 */
app.route('/v2/video/review').post( require('./legacy/v2/video/v2CreateVideoReview') ) // 22. 10. 21 새로 만든 비디오 리뷰 생성
app.route('/video/review')
    .post( require('./legacy/origin/video/createVideoReview') )
    .delete( require('./legacy/origin/video/deleteVideoReview') )
app.route('/video/content').put( require('./legacy/origin/video/updateVideoContent') )
app.route('/video/search/result/list').get( require('./legacy/origin/video/selectVideoSearchResult') )

/**
 * review api
 */
 app.route('/v1/review/photo').put( require('./legacy/origin/review/updatePhotoReview'))
 app.route('/v1/review/photo').delete( require('./legacy/origin/review/deletePhotoReview'))
 app.route('/review/photo').post( require('./legacy/origin/review/createPhotoReview'))

/**
 * comment api
 */
app.route('/comment')
    .post( require('./legacy/origin/comment/createComment') )
    .delete( require('./legacy/origin/comment/deleteComment') )
app.route('/v2/comment').post( require('./legacy/v2/comment/v2CreateComment') )
app.route('/v2/comment/nested').post( require('./legacy/v2/comment/v2CreateNestedComment') )
app.route('/comment/nested')
    .post( require('./legacy/origin/comment/createNestedComment') )
    .delete( require('./legacy/origin/comment/deleteNestedComment') )

// app.route('/comment/nested/list').get( require('./comment/selectNestedCommentList') ) // 비로그인 때 주석함 22. 10. 20

/**
 * like api
 */
app.route('/like').put( require('./legacy/origin/like/updateLike') )
app.route('/like/product/list').get( require('./legacy/origin/like/selectLikeProductList') )
app.route('/like/video/list').get( require('./legacy/origin/like/selectLikeVideoList') )

/**
 * addressbook api
 */
app.route('/addressbook')
    .post( require('./legacy/origin/addressBook/createAddressBook') )
    .put( require('./legacy/origin/addressBook/updateAddressBook') )
    .delete( require('./legacy/origin/addressBook/deleteAddressBook') )
app.route('/addressbook/island').get( require('./legacy/origin/addressBook/selectAddressBookIslandCheck') )
app.route('/addressbook/list').get( require('./legacy/origin/addressBook/selectAddressBookList') )
app.route('/addressbook/detail').get( require('./legacy/origin/addressBook/selectAddressBookDetail') )


/**
 * qna api
 */
app.route('/qna')
    .post( require('./legacy/origin/qna/createQnA') )
    .put( require('./legacy/origin/qna/updateQnA') )
    .delete( require('./legacy/origin/qna/deleteQnA') )
app.route('/qna/list').get( require('./legacy/origin/qna/selectQnAList') )
app.route('/qna/list/me').get( require('./legacy/origin/qna/selectQnAListMe') )
app.route('/v2/qna/list').get( require('./legacy/v2/qna/v2SelectProductQna') )

/**
 * report api
 */
app.route('/report').post( require('./legacy/origin/report/createReport') )



/**
 * etc api
 */
// app.route('/private/shared/count/plus').put( require('./video/updateSharedCount') )

/**
 * follow api
 */
app.route('/follow')
    .delete( require('./legacy/origin/follow/deleteFollow') )
    .post( require('./legacy/origin/follow/createFollow') )
// app.route('/follow/find/list').get( require('./follow/selectFollowFindList') ) // 비로그인 때 주석함 22. 10. 20


/**
 * searchView api
 */
// app.route('/searchview/list/all').get(require('./searchView/selectSerchViewListAll')) // 모아보기 모든 정보 불러오기 // 비로그인 때 주석함 22. 10. 20
app.route('/searchview/popular/category/product/preview/list').get( require('./legacy/origin/searchView/selectSearchViewPopularCategoryProductList')) // 인기 카테고리 목록
app.route('/searchview/new/category/video/list').get( require('./legacy/origin/searchView/selectSearchViewNewCategoryVideoList') )// 신규 카테고리 영상 목록

// app.route('/searchview/recommend/list').get( require('./searchView/selectSearchViewRecommendList') )// 추천상품검색정보 // 비로그인 때 주석함 22. 10. 20

// app.route('/searchview/ad/list').get( require('./searchView/selectSearchViewAdList') ) // 광고이미지 목록 // 비로그인 때 주석함 22. 10. 20
// app.route('/searchview/weggledeal/video/list').get( require('./searchView/selectSearchViewWeggledealVideoList') ); // 위글딜영상 목록 // 비로그인 때 주석함 22. 10. 20
app.route('/searchview/new/product/list').get( require('./legacy/origin/searchView/selectSearchViewNewProductList') ); // 신규상품 목록
app.route('/searchview/new/review/list').get( require('./legacy/origin/searchView/selectSearchViewNewReviewList') ); // 신규리뷰 목록

/**
 * v2SearchView api
 * 22년 12월 24일부터 적용
 */
app.route('/v2/searchview/recent/viewed/list').get( require('./legacy/v2/v2SearchView/v2SelectProductRecentViewedList') ) //최근 본 상품목록 더보기


// 모아보기 api legacy
// 앱 초창기 모아보기 리스트
app.route('/searchview').get( require('./legacy/origin/searchView/selectSearchViewInfo') ) // 검색화면 모든정보
// app.route('/searchview/search/list').get( require('./video/selectSearchViewSearchList') ) // 이전 검색리스트

// 모아보기 api legacy
// app_version1.5.4, app_code73
// app.route('/searchview/new/product/preview/list').get( require('./searchView/selectSearchViewNewProductPreviewList') ); // 신규상품 미리보기 // 비로그인 때 주석함 22. 10. 20
app.route('/searchview/new/review/preview/list').get( require('./legacy/origin/searchView/selectSearchViewNewReviewPreviewList') ); // 신규리뷰 미리보기
// app.route('/searchview/weggledeal/preview/list').get( require('./searchView/selectSearchViewWeggledealPreviewList') ); // 위글딜 미리보기 // 비로그인 때 주석함 22. 10. 20
// app.route('/searchview/hot/weggler/list').get( require('./searchView/selectSearchViewHotWegglerlist') ) // 핫위글러 목록 // 비로그인 때 주석함 22. 10. 20
// app.route('/searchview/best/review/list').get( require('./searchView/selectSearchViewBestReviewList') ); // 베스트 리뷰 목록 // 비로그인 때 주석함 22. 10. 20
// app.route('/searchview/new/review/list').get( require('./searchView/selectSearchViewNewReviewList') );


/**
 * notice api
 */
app.route('/notice/list').get( require('./legacy/origin/notice/selectNoticeViewList') )

/**
 * gift api
 */
app.route('/gift/order').post( require('./legacy/origin/gift/createGiftOrder'))
                              .put( require('./legacy/origin/gift/updateGiftOrder'))
                              .get(require('./legacy/origin/gift/selectGiftOrder'));
app.route('/gift/refuse').put(require('../middleware/legacy/origin/bootPay'), require('./legacy/origin/gift/updateGiftRefuse') );
app.route('/gift/refund').put(require('../middleware/legacy/origin/bootPay'), require('./legacy/origin/gift/updateGiftRefund') );
app.route('/v2/gift/box/received').get(require('./legacy/v2/gift/v2SelectGiftBoxReceived') );
app.route('/v2/gift/box/gived').get(require('./legacy/v2/gift/v2SelectGiftBoxGived') );

app.route('/v3/gift/order').post(require('./v3/gift/v3CreateGiftOrder'));

/**
 * Alert
 */
app.route('/alert/history/list').get( require('./legacy/origin/alert/selectAlertHistoryList')) //알람 히스토리 리스트 불러오기
app.route('/alert/list').get( require('./legacy/origin/alert/selectAlertList')) //알림차단 리스트 불러오기
app.route('/alert').put(require('./legacy/origin/alert/updateAlertState')) //알림 차단 api

// 알람차단 api legacy
// app_version1.5.4, app_code73
app.route('/alert/review/video').put(require('./legacy/origin/alert/version_legacy73/updateAlertReviewVideo')) //리뷰비디오알림 수정
app.route('/alert/order/confirm').put(require('./legacy/origin/alert/version_legacy73/updateAlertOrderConfirm')) //주문확정알림 수정
app.route('/alert/order/confirm/request').put(require('./legacy/origin/alert/version_legacy73/updateAlertOrderConfirmRequest')) //주문확정요청알림 수정
app.route('/alert/comment').put(require('./legacy/origin/alert/version_legacy73/updateAlertComment')) //댓글알림수정
app.route('/alert/nested/comment').put(require('./legacy/origin/alert/version_legacy73/updateNestedComment')) //대댓글알림수정
app.route('/alert/product/qna').put(require('./legacy/origin/alert/version_legacy73/updateProductQna')) //문의알림수정

/**
 * Block
 */
app.route('/block').post( require('./legacy/origin/block/createBlock')) //차단하기(영상, 댓글, 대댓글)
app.route('/block/user/list').get( require('./legacy/origin/block/selectBlockUserList')) //차단 유저 목록 리스트
app.route('/block/user').put( require('./legacy/origin/block/updateBlockUser')) //유저 차단 해제

/**
 * promotion
 */

/**
 *  dev
 */
app.route('/dev/searchview/new/product/list').get( require('./_dev/_dev_selectSearchViewNewProductList'))

/**
 * dev groupbuying api
 */
app.route('/v1/groupbuying/filter').get( require('./legacy/v1/groupbuying/v1SelectGroupBuyingFilter') )
app.route('/v1/groupbuying/order').post( require('./legacy/v1/groupbuying/v1CreateGroupBuyingOrder') )

/**
 * weggler api
 */
app.route('/v2/weggler/follow/feed/list').get( require('./legacy/v2/weggler/v2SelectFollowFeedList') )
app.route('/v2/weggler/recommend/feed/list').get( require('./legacy/v2/weggler/v2SelectRecommendFeedList') )
app.route('/v2/weggler/follow/recommend/list').get( require('./legacy/v2/weggler/v2SelectFollowRecommendList') )
app.route('/v2/weggler/community/letmeknow').post( require('./legacy/v2/weggler/v2CreateCommunityLetMeKnow') )
app.route('/v2/weggler/community/buytogether').post( require('./legacy/v2/weggler/v2CreateCommunityBuyTogether') )
app.route('/v2/weggler/search/groupbuying/list').get( require('./legacy/v2/weggler/v2SelectSearchGroupBuying') )
app.route('/v2/weggler/buytogether/detail').get( require('./legacy/v2/weggler/v2SelectBuyTogetherDetail') )
app.route('/v2/weggler/letmeknow/detail').get( require('./legacy/v2/weggler/v2SelectLetMeKnowDetail') )
app.route('/v2/weggler/community/comment/list').get( require('./legacy/v2/weggler/v2SelectCommunityComment') )
app.route('/v2/weggler/community/home').get( require('./legacy/v2/weggler/v2SelectCommunityHome') )
app.route('/v2/weggler/community/best/post/all').get( require('./legacy/v2/weggler/v2SelectCommunityBestPostAll') )
app.route('/v2/weggler/community/buytogether/list/all').get( require('./legacy/v2/weggler/v2SelectCommunityBuyTogetherList') )
app.route('/v2/weggler/community/letmeknow/list/all').get( require('./legacy/v2/weggler/v2SelectCommunityLetMeKnowList') )
app.route('/v2/weggler/iwrote/post').get( require('./legacy/v2/weggler/v2SelectThePostIWrotePost') )
app.route('/v2/weggler/iwrote/comment').get( require('./legacy/v2/weggler/v2SelectThePostIWroteComment') )
app.route('/v2/weggler/recommend/review/list').get( require('./legacy/v2/weggler/v2SelectRecommendReviewList') )
app.route('/v2/weggler/community/post').delete( require('./legacy/v2/weggler/v2DeleteCommunityPost') )
app.route('/v2/weggler/community/post').put( require('./legacy/v2/weggler/v2UpdateCommunityPost') )
app.route('/v2/weggler/story/visit').post( require('./legacy/v2/weggler/v2CreateWegglerStoryVisit') )
app.route('/v2/weggler/follow/feed/story/list').get( require('./legacy/v2/weggler/v2SelectFeedStoryList') )
app.route('/v2/weggler/story/detail').get( require('./legacy/v2/weggler/v2SelectWegglerStoryDetail') )
app.route('/v2/weggler/story/detail/simple').get( require('./legacy/v2/weggler/v2SelectWegglerStoryDetailSimple') )
app.route('/v2/weggler/ranking').get( require('./legacy/v2/weggler/v2SelectRankingWeggler')) // 위글러 랭킹 위글러
app.route('/v2/weggler/ranking/detail').get( require('./legacy/v2/weggler/v2SelectRankingWegglerDetail')) // 위글러 랭킹 위글러
app.route('/v2/weggler/search/community/post').get( require('./legacy/v2/weggler/v2SelectSearchCommunityPost')) // 위글러 랭킹 위글러


/**
 * private => public으로 옮긴 라우터들 22. 11. 02 
 */
app.route('/product/feed/list').get( require('./legacy/origin/product/selectProductFeedList') )
app.route('/video/count/view').put( require('./legacy/origin/video/updateVideoCountView') )
app.route('/comment/list').get( require('./legacy/origin/comment/selectCommentList') ) //확인 해봐야 함
app.route('/video/info').get( require('./legacy/origin/video/selectVideoInfo') )
app.route('/product/detail').get( require('./legacy/origin/product/selectProductDetail') )
app.route('/user/info/other').get( require('./legacy/origin/user/selectUserInfoOther') )//확인 해봐야 함
app.route('/product/category/list').get(require('./legacy/origin/product/selectProductCategoryList')) //220601부터 카테고리탭 생성됨
app.route('/v1/searchview/list/all').get(require('./legacy/v1/searchView/v1SelectSerchViewListAll')) // 모아보기 모든 정보 불러오기
app.route('/promotion/list/all').get( require('./legacy/origin/promotion/selectPromotionPreviewList')) //모든 프로모션 화면 미리보기
app.route('/video/count/shared').put( require('./legacy/origin/video/updateVideoCountShared') )
app.route('/follow/list').get( require('./legacy/origin/follow/selectFollowList') )
app.route('/v1/follow/list').get( require('./legacy/v1/follow/v1SelectFollowList') )
app.route('/v1/follower/list').get( require('./legacy/v1/follow/v1SelectFollowerList') )
app.route('/product/option/list').get( require('./legacy/origin/product/selectProductOptionList') )
app.route('/product/detail/review/list').get( require('./legacy/origin/product/selectProductDetailReviewList') )//2022/07/06 리뷰 영상, 사진, 카운트 같이 불러오기
app.route('/user/profile/photo/list').get( require('./legacy/origin/user/selectUserProfileReviewPhotoList') )// 새 리뷰 리스트. 상품, 리뷰만 나온다.
app.route('/user/profile/video/list').get( require('./legacy/origin/user/selectUserProfileReviewVideoList') )// 새 리뷰 리스트. 영상, 리뷰만 나온다.
app.route('/promotion/list').get( require('./legacy/origin/promotion/selectPromotionList')) //프로모션 더보기
app.route('/v1/searchview/list/gongudeal').get(require('./legacy/v1/searchView/v1SelectSerchViewListGonguDeal')) // 공구딜 전체보기
app.route('/v1/searchview/list/gongudeadline').get(require('./legacy/v1/searchView/v1SelectSerchViewListGonguDeadline')) // 공구 마감임박 전체보기
app.route('/v1/groupbuying/detail').get( require('./legacy/v1/groupbuying/v1SelectGroupBuyingDetailView') )
app.route('/product/name/list').get( require('./legacy/origin/product/selectProductNameList'))
app.route('/review/photo').get( require('./legacy/origin/review/selectPhotoReview'))
app.route('/review/video').get( require('./legacy/origin/review/selectVideoReview'))
app.route('/v2/user/info/other').get( require('./legacy/v2/user/v2SelectUserInfoOther') )
app.route('/v1/follow/search/list').get( require('./legacy/v1/follow/v1SelectFollowSearchList') )
app.route('/v1/follower/search/list').get( require('./legacy/v1/follow/v1SelectFollowerSearchList') )
app.route('/user/profile/list').get( require('./legacy/origin/user/selectUserProfileList') )// 새 리뷰 리스트. 상품,영상,리뷰가 전부 나온다.
app.route('/searchview/search/list/hashtag').get( require('./legacy/origin/searchView/selectSearchViewHashTagSearchList') ) // 태그검색정보
app.route('/searchview/search/list/user').get( require('./legacy/origin/searchView/selectSearchViewUserSearchList') ) // 사용자검색정보
app.route('/searchview/search/list').get( require('./legacy/origin/searchView/selectSearchViewSearchList') ) // 영상검색정보
app.route('/product/review/list').get( require('./legacy/origin/product/selectProductReviewList') )
app.route('/v1/groupbuying/detail/room/list').get( require('./legacy/v1/groupbuying/v1SelectGroupBuyingRoomList') )
app.route('/v1/feed/product/list').get( require('./legacy/v1/feed/v1SelectFeedProductList') )
app.route('/video/hashtag/list').get( require('./legacy/origin/video/selectVideoHashTagList') )
app.route('/v2/feed/review/list').get( require('./legacy/v2/feed/v2SelectFeedReviewList') )

/**
 * event
 */
app.route('/v2/event/filename').get( require('./legacy/v2/event/v2SelectEventImage'))
app.route('/v2/event/check').get( require('./legacy/v2/event/v2SelectEventUser'))//이벤트 당첨자 체크
app.route('/v2/event/order').post( require('./legacy/v2/event/v2CreateEventOrder'))//이벤트 상품 구매

/**
 * challenge
 */
app.route('/v2/challenge/list').get( require('./legacy/v2/challenge/v2SelectChallengeList')) // 챌린지 리스트
app.route('/v2/challenge/detail/list').get( require('./legacy/v2/challenge/v2SelectChallengeDetailList')) // 챌린지 디테일 리스트
app.route('/v2/challenge/product/check').get( require('./legacy/v2/challenge/v2SelectChallengeProductCheck')) // 챌린지 리뷰 생성 전 진행중인 챌린지 유무 확인 및 상품 정보 받아옴
app.route('/v2/challenge/video/review').post( require('./legacy/v2/challenge/v2CreateChallengeVideoReview')) // 챌린지 리뷰 생성
app.route('/v2/challenge/guide').get( require('./legacy/v2/challenge/v2SelectChallengeGuide')) // 챌린지 리뷰 생성

module.exports = app;