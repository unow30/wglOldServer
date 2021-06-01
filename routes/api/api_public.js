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

/**
 * file api
 */
app.route('/file').post( require('../../common/utils/awsS3Util_v2').uploadFile, require('./file/uploadFile') );
// app.route('/public/image').post( require('../../common/utils/awsS3Util_v2').uploadImage, require('./file/uploadFile') );
// app.route('/public/video').post( require('../../common/utils/awsS3Util_v2').uploadVideo, require('./file/uploadFile') );



/**
 * dev api
 */
app.route('/dev/test').get( require('./_dev/_dev_select') )


/**
 * daum api
 */
app.route('/postcode').get( require('./postcode/selectPostcode') );


module.exports = app;
