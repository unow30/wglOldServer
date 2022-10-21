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
app.route('/v1/feed/list').get( require('../middleware/publicCheckToken') ,require('./feed/v1selectFeedList')) // 추후에 미들웨어 app에서 넣어주는걸로
// app.route('/v1/gongu/feed/list').get( require('./feed/public_v1SelectGonguFeedList') )
// app.route('/feed/list/m3u8').get( require('./feed/public_selectFeedList_m3u8') )


/* 임시 안드로이드 라우터 위에 feed list와 마찬가지로 ios, android */
app.route('/v1/user/signup').post(require('../middleware/publicCheckToken'), require('./user/createUser') )
app.route('/v1/user/signup/check').get(require('../middleware/publicCheckToken'), require('./user/selectSignUpCheck') )
app.route('/v1/user/email/check').get(require('../middleware/publicCheckToken'), require('./user/selectUserEmailCheck') )
app.route('/v1/user/nickname/check').get(require('../middleware/publicCheckToken'), require('./user/selectUserNicknameCheck') )
app.route('/v1/user/phone/check').get(require('../middleware/publicCheckToken'), require('./user/selectUserPhoneCheck') )
app.route('/v1/user/recommendee/code/check').get(require('../middleware/publicCheckToken'), require('./user/selectUserRecommendeeCodeCheck') )

module.exports = app;