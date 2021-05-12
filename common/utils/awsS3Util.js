/**
 * Created by hyunhunhwang on 2020. 12. 22.
 */
const path = require('path');
const multer  = require('multer');
const multerS3 = require('multer-s3');
const crypto = require('crypto');
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const errCode = require('../define/errCode');

const funcUtil = require('./funcUtil');
const sendUtil = require('./sendUtil');
const errUtil = require('./errUtil');

AWS.config.update({
    accessKeyId: funcUtil.getAWSAccessKeyID(),
    secretAccessKey: funcUtil.getAWSSecretAccessKey(),
    region : funcUtil.getAWSRegion(),
});

const MAX_LENGTH_MB=20

const fileFilter = (req, file, next) => {
    // console.log('fileFilter file : '+JSON.stringify(file));
    const isPhoto = file.mimetype.startsWith('file/');
    if (isPhoto) {
        next(null, true); // null for error means it worked and it is fine to continue to next()
    } else {
        next({ message: '사용 할 수 없는 파일 형식 입니다.' }, false); // with error
    }
};

const multerOptions = {
    fileFilter: fileFilter,
    storage: multerS3({
        s3: s3,
        bucket: funcUtil.getAWSBucket(),
        contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
        acl: 'public-read', // 클라이언트에서 자유롭게 가용하기 위함
        metadata: function (req, file, cb) {
            // console.log('metadata file : '+JSON.stringify(file));
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            // let req_keys = Object.keys( req );
            let extension = path.extname(file.originalname);
            let basename = path.basename(file.originalname, extension);        //확장자 .jpg 만 빠진 파일명을 얻어온다
            let hash_name = crypto.createHash('md5').update(Date.now()+basename).digest("hex");
            let final_name = `${hash_name}${extension}`;
            cb(null, final_name);
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * MAX_LENGTH_MB, // 1mb 이하만,
        files: 1
    },
};

function uploadFunc(req, res, next){
    // console.log('awsS3Util, uploadFunc start ..............');
    let single = multer(multerOptions).single('file_name');
    single(req, res, function (err) {
        if(err){
            // console.log('multer err : '+JSON.stringify(err));
            console.log('awsS3Util, multer err.code : '+err.code);
            console.log('awsS3Util, multer err.stack : '+err.stack);
            // console.log('awsS3Util, multer err : '+err.message);
            if( err.code === 'LIMIT_FILE_SIZE' ){
                let _er = errUtil.createCall(errCode.system, `최대 업로드 가능한 파일 사이즈는 ${MAX_LENGTH_MB}mb 입니다.`);
                sendUtil.sendErrorPacket(req, res, _er);
            }
            else {
                sendUtil.sendErrorPacket(req, res, err);
            }
        }
        else {
            next();
        }
    })
}

exports.uploadFunc = uploadFunc;
