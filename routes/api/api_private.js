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
app.route('/user/profile/review/list').put( require('./user/selectUserProfileReviewList') )

app.route('/user/info/me').get( require('./user/selectUserInfoMe') )
app.route('/user/info/other').get( require('./user/selectUserInfoOther') )
app.route('/user/profile/review/list').get( require('./user/selectUserProfileReviewList') )


app.route('/user/bank/info').get( require('./user/selectUserBankInfo') )

/**
 * product api
 */
app.route('/product/confirm/list').get( require('./product/selectProductConfirmList') )
app.route('/product/detail').get( require('./product/selectProductDetail') )
app.route('/product/feed/list').get( require('./product/selectProductFeedList') )
app.route('/product/review/list').get( require('./product/selectProductReviewList') )
app.route('/product/option/list').get( require('./product/selectProductOptionList') )
app.route('/product/video/list').get( require('./product/selectProductVideoList') )
app.route('/product/recent/viewed')
    .put(require('./product/updateProductRecentViewed'))
    .get( require('./product/selectProductRecentViewedList') )


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
app.route('/order/detail').get( require('./order/selectOrderDetail') )
app.route('/order/confirm').put( require('./order/updateOrderConfirm') )
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

/**
 * like api
 */
app.route('/like').put( require('./like/updateLike') )
app.route('/like/product/list').get( require('./like/selectLikeProductList') )

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
app.route('/searchview').get( require('./searchView/selectSearchViewInfo') )
app.route('/searchview/recommend/list').get( require('./searchView/selectSearchViewRecommendList') )
app.route('/searchview/search/list').get( require('./video/selectSearchViewSearchList') )



module.exports = app;
