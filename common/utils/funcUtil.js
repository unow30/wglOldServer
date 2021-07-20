/**
 * Created by hyunhunhwang on 2020. 12. 21.
 */
const osUtil = require('./osUtil');

module.exports = {

    isRealServer: _isRealServer(),
    getServerType: function () {
        return _isRealServer() ? 'real_server' : 'test_server';
    },
    getFilePath: function (){
        return _isRealServer() ? process.env.REAL_FILE_PATH : process.env.DEV_FILE_PATH;
    },

    /**
     * DB function
     * @returns {*}
     */
    getDBHost: function (){
        return _isRealServer() ? process.env.REAL_DB_HOST : process.env.DEV_DB_HOST;
    },
    getDBUser: function (){
        return _isRealServer() ? process.env.REAL_DB_USER : process.env.DEV_DB_USER;
    },
    getDBPassword: function (){
        return _isRealServer() ? process.env.REAL_DB_PASS : process.env.DEV_DB_PASS;
    },
    getDBSchema: function (){
        return _isRealServer() ? process.env.REAL_DB_SCHEMA : process.env.DEV_DB_SCHEMA;
    },


    /**
     * AWS function
     * @returns {*}
     */
    getAWSAccessKeyID: function (){
        return _isRealServer() ? process.env.REAL_AWS_ACCESS_KEY_ID : process.env.DEV_AWS_ACCESS_KEY_ID;
    },
    getAWSSecretAccessKey: function(){
        return _isRealServer() ? process.env.REAL_AWS_SECRET_ACCESS_KEY : process.env.DEV_AWS_SECRET_ACCESS_KEY;
    },
    getAWSRegion: function(){
        return _isRealServer() ? process.env.REAL_AWS_REGION : process.env.DEV_AWS_REGION;
    },
    getAWSBucket: function(){
        return _isRealServer() ? process.env.REAL_AWS_BUCKET : process.env.DEV_AWS_BUCKET;
    },
    getFilePath: function(){
        return _isRealServer() ? process.env.REAL_FILE_PATH : process.env.DEV_FILE_PATH;
    },

}

function _isRealServer(){
    return osUtil.getIpAddress() === process.env.REAL_PRIVATE_IP;
}
