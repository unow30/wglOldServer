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


const MAX_LENGTH_MB=2000

const fileOptions = {
    storage: multerS3({
        s3: s3,
        bucket: `${funcUtil.getAWSBucket()}`,
        contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
        acl: 'public-read', // 클라이언트에서 자유롭게 가용하기 위함
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            // cb(null, getFilename(req, file));  // 초반에 하고 주석풀어야함
            cb(null, file.originalname); // << 용도 1회성 가존 mp4 -> m3u8 변경용
        },
    }),
    limits: {
        fileSize: 1024 * 1024 * MAX_LENGTH_MB, // {n}mb 이하만,
        files: 1
    },
};

function getFilename(req, file){
    try {
        let originalname = file.originalname;
        console.log("ASIJAFIAJF: "  + file.originalname);
        if(file.originalname.includes('.mp4'))
            originalname = replaceName(file.originalname);

        console.log("ASIJAFIAJ1231312F: "  + originalname);

        let extension = path.extname(originalname);
        let basename = path.basename(originalname, extension);        //확장자 .jpg 만 빠진 파일명을 얻어온다
        let hash_name = crypto.createHash('md5').update(Date.now()+basename).digest("hex");
        return `${hash_name}${extension}`;
    }
    catch (e) {
        let _err = errUtil.initError(errCode.fail, '동영상 변환에 실패했습니다. 다시 시도해주세요.');
        sendUtil.sendErrorPacket(req, res, _err);
    }

}

function uploadFile(req, res, next){
    console.log('awsS3Util, uploadFile start ..............');
    let single = multer(fileOptions).single('file');
    single(req, res, function (err) {
        if(err){
            console.log('awsS3Util, multer err.code : '+err.code);
            console.log('awsS3Util, multer err.stack : '+err.stack);
            if( err.code === 'LIMIT_FILE_SIZE' ){
                sendUtil.sendErrorPacket(req, res, errUtil.initError(errCode.system, `최대 업로드 가능한 파일 사이즈는 ${MAX_LENGTH_MB}mb 입니다.`));
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

function replaceName(filename) {
    let fileArray = filename.split(".mp4");

    filename = filename.replace(fileArray[1], '');

    return filename;
}

exports.uploadFile = uploadFile;