/**
 * Created by hyunhunhwang on 2021. 01. 21.
 */
const express = require('express');
const app = express();


/**
 * user api
 */
app.route('/user').put( require('./user/updateUser') )
app.route('/user/profile/review/list').put( require('./user/selectUserProfileReviewList') )

app.route('/user/info/me').get( require('./user/selectUserInfoMe') )
app.route('/user/info/other').get( require('./user/selectUserInfoOther') )
app.route('/user/profile/review/list').get( require('./user/selectUserProfileReviewList') )


app.route('/user/bank/info').get( require('./user/selectUserBankInfo') )
app.route('/user/bank/info').put( require('./user/updateUserBankInfo') )

/**
 * product api
 */
app.route('/product/detail').get( require('./product/selectProductDetail') )
app.route('/product/feed/list').get( require('./product/selectProductFeedList') )
app.route('/product/review/list').get( require('./product/selectProductReviewList') )
app.route('/product/option/list').get( require('./product/selectProductOptionList') )

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
app.route('/order/status').put( require('./order/updateOrderStatus') )

/**
 * reward api
 */
app.route('/reward').post( require('./reward/createReward') )
    .get( require('./reward/selectReward') )
app.route('/reward/list').get( require('./reward/selectRewardList') )
app.route('/reward/detail/list').get( require('./reward/selectRewardDetailList') )

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
app.route('/video/review/list').get( require('./video/selectVideoReviewList') )
app.route('/video/count/shared').put( require('./video/updateVideoCountShared') )
app.route('/video/count/view').put( require('./video/updateVideoCountView') )
app.route('/video/review')
    .post( require('./video/createVideoReview') )
    .delete( require('./video/deleteVideoReview') )

/**
 * comment api
 */
app.route('/comment')
    .post( require('./comment/createComment') )
    .delete( require('./comment/deleteComment') )
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




module.exports = app;
