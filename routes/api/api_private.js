/**
 * Created by hyunhunhwang on 2021. 01. 21.
 */
const express = require('express');
const app = express();


/**
 * user api
 */
app.route('/v2/user').put( require('./user/v2UpdateUser') )
app.route('/user').put( require('./user/updateUser') )
                  .delete( require('./user/deleteUser') )
// app.route('/user/profile/review/list').put( require('./user/selectUserProfileReviewList') )

app.route('/v2/user/info/me').get( require('./user/v2SelectUserInfoMe') )
app.route('/v2/user/reward/info').get( require('./user/v2SelectUserRefundInfo') )
app.route('/v2/user/my/activity/comment').get( require('./user/v2SelectUserMyActivityComment') )
app.route('/v2/user/my/activity/post').get( require('./user/v2SelectUserMyActivityPost') )
app.route('/v2/user/my/activity/review/detail').get( require('./user/v2SelectUserMyActivityReviewDetail') )

app.route('/user/info/me').get( require('./user/selectUserInfoMe') )
app.route('/user/info/me/fcm').get( require('./user/selectFcmInfoMe'))
app.route('/user/profile/review/list').get( require('./user/selectUserProfileReviewList') )

/**
 * file api
 */
app.route('/v2/file/reward/info/image').post(require('../middleware/rewardInfoImageUpload'), require('./file/v2UploadRewardInfoImage'))
app.route('/v2/upload/files').post( require('../middleware/s3MediaUpload'), require('./file/v2UploadFileArray') );

/**
 * product api
 */

// app.route('/product/confirm/list').get( require('./product/selectProductConfirmList') ) // 비로그인 때 주석함 22. 10. 20
app.route('/v1/product/confirm/list').get( require('./product/v1SelectProductConfirmList') )
app.route('/product').get(require('./product/selectProductItem')) //상품 item만 불러온다.
app.route('/product/video/list').get( require('./product/selectProductVideoList') )
app.route('/product/recent/viewed')
    .put(require('./product/updateProductRecentViewed'))
    .get( require('./product/selectProductRecentViewedList') )
    .delete( require('./product/deleteProductRecentViewedList') )



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
app.route('/v2/reward').post( require('./reward/v2CreateReward') )
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
app.route('/v2/point/history').get( require('./point/v2SelectPointHistory') )


/**
 * feed api
 */
// app.route('/feed/list').get( require('./feed/selectFeedList') ) //22. 11. 08일 주석 처리 퍼블릭에서 사용해야함
// app.route('/v1/feed/list').get( require('./feed/v1SelectFeedList') ) //22. 11. 08일 주석 처리 퍼블릭에서 사용해야함
app.route('/v1/gongu/feed/list').get( require('./feed/v1SelectGonguFeedList') )
app.route('/feed/list/m3u8').get( require('./feed/selectFeedList_m3u8') )

/**
 * weggleDeal api
 */
app.route('/weggledeal/list').get( require('./weggleDeal/selectWeggleDealList') )

/**
 * video api
 */
app.route('/v2/video/review').post( require('./video/v2CreateVideoReview') ) // 22. 10. 21 새로 만든 비디오 리뷰 생성
app.route('/video/review')
    .post( require('./video/createVideoReview') )
    .delete( require('./video/deleteVideoReview') )
app.route('/video/content').put( require('./video/updateVideoContent') )
app.route('/video/search/result/list').get( require('./video/selectVideoSearchResult') )

/**
 * review api
 */
 app.route('/v1/review/photo').put( require('./review/updatePhotoReview'))
 app.route('/v1/review/photo').delete( require('./review/deletePhotoReview'))
 app.route('/review/photo').post( require('./review/createPhotoReview'))

/**
 * comment api
 */
app.route('/comment')
    .post( require('./comment/createComment') )
    .delete( require('./comment/deleteComment') )
app.route('/v2/comment').post( require('./comment/v2CreateComment') )
app.route('/v2/comment/nested').post( require('./comment/v2CreateNestedComment') )
app.route('/comment/nested')
    .post( require('./comment/createNestedComment') )
    .delete( require('./comment/deleteNestedComment') )

// app.route('/comment/nested/list').get( require('./comment/selectNestedCommentList') ) // 비로그인 때 주석함 22. 10. 20

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
app.route('/addressbook/island').get( require('./addressBook/selectAddressBookIslandCheck') )
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
app.route('/v2/qna/list').get( require('./qna/v2SelectProductQna') )

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
// app.route('/follow/find/list').get( require('./follow/selectFollowFindList') ) // 비로그인 때 주석함 22. 10. 20


/**
 * searchView api
 */
// app.route('/searchview/list/all').get(require('./searchView/selectSerchViewListAll')) // 모아보기 모든 정보 불러오기 // 비로그인 때 주석함 22. 10. 20
app.route('/searchview/popular/category/product/preview/list').get( require('./searchView/selectSearchViewPopularCategoryProductList')) // 인기 카테고리 목록
app.route('/searchview/new/category/video/list').get( require('./searchView/selectSearchViewNewCategoryVideoList') )// 신규 카테고리 영상 목록

// app.route('/searchview/recommend/list').get( require('./searchView/selectSearchViewRecommendList') )// 추천상품검색정보 // 비로그인 때 주석함 22. 10. 20

// app.route('/searchview/ad/list').get( require('./searchView/selectSearchViewAdList') ) // 광고이미지 목록 // 비로그인 때 주석함 22. 10. 20
// app.route('/searchview/weggledeal/video/list').get( require('./searchView/selectSearchViewWeggledealVideoList') ); // 위글딜영상 목록 // 비로그인 때 주석함 22. 10. 20
app.route('/searchview/new/product/list').get( require('./searchView/selectSearchViewNewProductList') ); // 신규상품 목록
app.route('/searchview/new/review/list').get( require('./searchView/selectSearchViewNewReviewList') ); // 신규리뷰 목록

/**
 * v2SearchView api
 * 22년 12월 24일부터 적용
 */
app.route('/v2/searchview/recent/viewed/list').get( require('./v2SearchView/v2SelectProductRecentViewedList') ) //최근 본 상품목록 더보기


// 모아보기 api legacy
// 앱 초창기 모아보기 리스트
app.route('/searchview').get( require('./searchView/selectSearchViewInfo') ) // 검색화면 모든정보
// app.route('/searchview/search/list').get( require('./video/selectSearchViewSearchList') ) // 이전 검색리스트

// 모아보기 api legacy
// app_version1.5.4, app_code73
// app.route('/searchview/new/product/preview/list').get( require('./searchView/selectSearchViewNewProductPreviewList') ); // 신규상품 미리보기 // 비로그인 때 주석함 22. 10. 20
app.route('/searchview/new/review/preview/list').get( require('./searchView/selectSearchViewNewReviewPreviewList') ); // 신규리뷰 미리보기
// app.route('/searchview/weggledeal/preview/list').get( require('./searchView/selectSearchViewWeggledealPreviewList') ); // 위글딜 미리보기 // 비로그인 때 주석함 22. 10. 20
// app.route('/searchview/hot/weggler/list').get( require('./searchView/selectSearchViewHotWegglerlist') ) // 핫위글러 목록 // 비로그인 때 주석함 22. 10. 20
// app.route('/searchview/best/review/list').get( require('./searchView/selectSearchViewBestReviewList') ); // 베스트 리뷰 목록 // 비로그인 때 주석함 22. 10. 20
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
app.route('/v2/gift/box/received').get(require('./gift/v2SelectGiftBoxReceived') );
app.route('/v2/gift/box/gived').get(require('./gift/v2SelectGiftBoxGived') );


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

/**
 *  dev
 */
app.route('/dev/searchview/new/product/list').get( require('./_dev/_dev_selectSearchViewNewProductList'))

/**
 * dev groupbuying api
 */
app.route('/v1/groupbuying/filter').get( require('./groupBuying/v1SelectGroupBuyingFilter') )
app.route('/v1/groupbuying/order').post( require('./groupBuying/v1CreateGroupBuyingOrder') )

/**
 * weggler api
 */
app.route('/v2/weggler/follow/feed/list').get( require('./weggler/v2SelectFollowFeedList') )
app.route('/v2/weggler/recommend/feed/list').get( require('./weggler/v2SelectRecommendFeedList') )
app.route('/v2/weggler/follow/recommend/list').get( require('./weggler/v2SelectFollowRecommendList') )
app.route('/v2/weggler/community/letmeknow').post( require('./weggler/v2CreateCommunityLetMeKnow') )
app.route('/v2/weggler/community/buytogether').post( require('./weggler/v2CreateCommunityBuyTogether') )
app.route('/v2/weggler/search/groupbuying/list').get( require('./weggler/v2SelectSearchGroupBuying') )
app.route('/v2/weggler/buytogether/detail').get( require('./weggler/v2SelectBuyTogetherDetail') )
app.route('/v2/weggler/letmeknow/detail').get( require('./weggler/v2SelectLetMeKnowDetail') )
app.route('/v2/weggler/community/comment/list').get( require('./weggler/v2SelectCommunityComment') )
app.route('/v2/weggler/community/home').get( require('./weggler/v2SelectCommunityHome') )
app.route('/v2/weggler/community/best/post/all').get( require('./weggler/v2SelectCommunityBestPostAll') )
app.route('/v2/weggler/community/buytogether/list/all').get( require('./weggler/v2SelectCommunityBuyTogetherList') )
app.route('/v2/weggler/community/letmeknow/list/all').get( require('./weggler/v2SelectCommunityLetMeKnowList') )
app.route('/v2/weggler/iwrote/post').get( require('./weggler/v2SelectThePostIWrotePost') )
app.route('/v2/weggler/iwrote/comment').get( require('./weggler/v2SelectThePostIWroteComment') )
app.route('/v2/weggler/recommend/review/list').get( require('./weggler/v2SelectRecommendReviewList') )
app.route('/v2/weggler/community/post').delete( require('./weggler/v2DeleteCommunityPost') )
app.route('/v2/weggler/community/post').put( require('./weggler/v2UpdateCommunityPost') )
app.route('/v2/weggler/story/visit').post( require('./weggler/v2CreateWegglerStoryVisit') )
app.route('/v2/weggler/follow/feed/story/list').get( require('./weggler/v2SelectFeedStoryList') )
app.route('/v2/weggler/story/detail').get( require('./weggler/v2SelectWegglerStoryDetail') )
app.route('/v2/weggler/story/detail/simple').get( require('./weggler/v2SelectWegglerStoryDetailSimple') )
app.route('/v2/weggler/ranking').get( require('./weggler/v2SelectRankingWeggler')) // 위글러 랭킹 위글러
app.route('/v2/weggler/ranking/detail').get( require('./weggler/v2SelectRankingWegglerDetail')) // 위글러 랭킹 위글러
app.route('/v2/weggler/search/community/post').get( require('./weggler/v2SelectSearchCommunityPost')) // 위글러 랭킹 위글러


/**
 * private => public으로 옮긴 라우터들 22. 11. 02 
 */
app.route('/product/feed/list').get( require('./product/selectProductFeedList') )
app.route('/video/count/view').put( require('./video/updateVideoCountView') )
app.route('/comment/list').get( require('./comment/selectCommentList') ) //확인 해봐야 함
app.route('/video/info').get( require('./video/selectVideoInfo') )
app.route('/product/detail').get( require('./product/selectProductDetail') )
app.route('/user/info/other').get( require('./user/selectUserInfoOther') )//확인 해봐야 함
app.route('/product/category/list').get(require('./product/selectProductCategoryList')) //220601부터 카테고리탭 생성됨
app.route('/v1/searchview/list/all').get(require('./searchView/v1SelectSerchViewListAll')) // 모아보기 모든 정보 불러오기
app.route('/promotion/list/all').get( require('./promotion/selectPromotionPreviewList')) //모든 프로모션 화면 미리보기
app.route('/video/count/shared').put( require('./video/updateVideoCountShared') )
app.route('/follow/list').get( require('./follow/selectFollowList') )
app.route('/v1/follow/list').get( require('./follow/v1SelectFollowList') )
app.route('/v1/follower/list').get( require('./follow/v1SelectFollowerList') )
app.route('/product/option/list').get( require('./product/selectProductOptionList') )
app.route('/product/detail/review/list').get( require('./product/selectProductDetailReviewList') )//2022/07/06 리뷰 영상, 사진, 카운트 같이 불러오기
app.route('/user/profile/photo/list').get( require('./user/selectUserProfileReviewPhotoList') )// 새 리뷰 리스트. 상품, 리뷰만 나온다.
app.route('/user/profile/video/list').get( require('./user/selectUserProfileReviewVideoList') )// 새 리뷰 리스트. 영상, 리뷰만 나온다.
app.route('/promotion/list').get( require('./promotion/selectPromotionList')) //프로모션 더보기
app.route('/v1/searchview/list/gongudeal').get(require('./searchView/v1SelectSerchViewListGonguDeal')) // 공구딜 전체보기
app.route('/v1/searchview/list/gongudeadline').get(require('./searchView/v1SelectSerchViewListGonguDeadline')) // 공구 마감임박 전체보기
app.route('/v1/groupbuying/detail').get( require('./groupBuying/v1SelectGroupBuyingDetailView') )
app.route('/product/name/list').get( require('./product/selectProductNameList'))
app.route('/review/photo').get( require('./review/selectPhotoReview'))
app.route('/review/video').get( require('./review/selectVideoReview'))
app.route('/v2/user/info/other').get( require('./user/v2SelectUserInfoOther') )
app.route('/v1/follow/search/list').get( require('./follow/v1SelectFollowSearchList') )
app.route('/v1/follower/search/list').get( require('./follow/v1SelectFollowerSearchList') )
app.route('/user/profile/list').get( require('./user/selectUserProfileList') )// 새 리뷰 리스트. 상품,영상,리뷰가 전부 나온다.
app.route('/searchview/search/list/hashtag').get( require('./searchView/selectSearchViewHashTagSearchList') ) // 태그검색정보
app.route('/searchview/search/list/user').get( require('./searchView/selectSearchViewUserSearchList') ) // 사용자검색정보
app.route('/searchview/search/list').get( require('./searchView/selectSearchViewSearchList') ) // 영상검색정보
app.route('/product/review/list').get( require('./product/selectProductReviewList') )
app.route('/v1/groupbuying/detail/room/list').get( require('./groupBuying/v1SelectGroupBuyingRoomList') )
app.route('/v1/feed/product/list').get( require('./feed/v1SelectFeedProductList') )
app.route('/video/hashtag/list').get( require('./video/selectVideoHashTagList') )
app.route('/v2/feed/review/list').get( require('./feed/v2SelectFeedReviewList') )

/**
 * event
 */
app.route('/v2/event/filename').get( require('./event/v2SelectEventImage'))
app.route('/v2/event/check').get( require('./event/v2SelectEventUser'))//이벤트 당첨자 체크
app.route('/v2/event/order').post( require('./event/v2CreateEventOrder'))//이벤트 상품 구매

/**
 * challenge
 */
app.route('/v2/challenge/list').get( require('./challenge/v2SelectChallengeList')) // 챌린지 리스트
app.route('/v2/challenge/detail/list').get( require('./challenge/v2SelectChallengeDetailList')) // 챌린지 디테일 리스트
app.route('/v2/challenge/product/check').get( require('./challenge/v2SelectChallengeProductCheck')) // 챌린지 리뷰 생성 전 진행중인 챌린지 유무 확인 및 상품 정보 받아옴
app.route('/v2/challenge/video/review').post( require('./challenge/v2CreateChallengeVideoReview')) // 챌린지 리뷰 생성

module.exports = app;