/**
 * Created by hyunhunhwang on 2021. 01. 21.
 */
const express = require('express');
const app = express();

/**
 * user api
 */
app.route('/user/signup').post( require('./user/createUser') )
app.route('/user/signup/check').get( require('./user/selectSignUpCheck') )
app.route('/user/email/check').get( require('./user/selectUserEmailCheck') )
app.route('/user/nickname/check').get( require('./user/selectUserNicknameCheck') )
app.route('/user/recommendee/code/check').get( require('./user/selectUserRecommendeeCodeCheck') )

/**
 * file api
 */
app.route('/file').post( require('../../common/utils/awsS3Util_v2').uploadFile, require('./file/uploadFile') );
// app.route('/public/image').post( require('../../common/utils/awsS3Util_v2').uploadImage, require('./file/uploadFile') );
// app.route('/public/video').post( require('../../common/utils/awsS3Util_v2').uploadVideo, require('./file/uploadFile') );

/**
 * cron order_cancel_gift
 */
app.route('/order/cancel/gift').put(require('../middleware/bootPay'), require('../api/gift/updateGiftRefund') );

/**
 * dev api
 */
app.route('/dev/test').get( require('./_dev/_dev_select') )
app.route('/dev/change/mp4/to/hls').put( require('./_dev/_dev_update_change_MP4_to_HLS') )
app.route('/dev/change/mp4/to/hls').get( require('./_dev/_dev_select_change_MP4_to_HLS') )



app.route('/user/auto/recommend').get( require('./user/autoRecommend') )

module.exports = app;
