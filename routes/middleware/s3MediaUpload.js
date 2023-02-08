const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const crypto = require('crypto');
const path = require('path');

const errCode = require('../../common/define/errCode');
const funcUtil = require('../../common/utils/funcUtil');

AWS.config.update({
    accessKeyId: funcUtil.getAWSAccessKeyID(),
    secretAccessKey: funcUtil.getAWSSecretAccessKey(),
    region : funcUtil.getAWSRegion(),
});
const s3 = new AWS.S3();

const mediaUpload = (req, res, next) =>{
    console.log(`1. mediaUpload 실행 시작:${process.memoryUsage()}`);
    new Promise((resolve, reject)=>{
        const upload = multer({
            storage: multerS3({
                s3: s3,
                bucket: `${funcUtil.getAWSBucket()}`,
                contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
                acl: 'public-read', // 클라이언트에서 자유롭게 가용하기 위함
                metadata: (req, file, cb) =>{
                    cb(null, {fieldName: file.fieldname});
                },
                key: function (req, file, cb) {
                    cb(null, getFilename(reject, file));
                },
            }),
            limits: {
                fileSize: (1024 * 1024) * 300, // {n}mb 이하만,
            },
        }).array('file',6);
        console.log(`2. upload에 multer 실행 완료:${process.memoryUsage()}`);
        upload(req, res, err =>{
            if(!err){
                return resolve(next);
            }
            else{
                return reject(err);
            }
        });
    })
    .then(next => next())
    .catch(err => {
        return res.status(err.status || 500).json({
            message: err.message || '업로드에 실패 하였습니다.',
            code: errCode.system|| 200,
            method: 'POST',
            url: "",
        })
    });
}

const  getFilename = (reject, file)=>{
    console.log('============>>hash func start <<===========')
    console.log(file)
    const originalName = file.originalname;
    const ext = path.extname(originalName)
    console.log(ext, '====>이건 뭘까')
    if((ext != '.jpg' && ext != '.jpeg' && ext != '.png' && 
       ext != '.gif' && ext != '.JPG' && ext != '.JPEG' && 
       ext != '.PNG' && ext != '.GIF' && ext != '.mp4' && ext != '.MP4')){
        const err = new Error('확장자가 유효하지 않습니다. jpg, jpeg, png, gif, mp4만 가능합니다.')
        err.status = 400
        err.code = errCode.system
        err.method = 'POST';
        err.url = ''

        return reject(err)
    };

    const base = originalName.split(ext)[0]        //확장자 .jpg 만 빠진 파일명을 얻어온다
    const hash_name = crypto.createHash('md5').update(Date.now()+base).digest("hex");
    const hashName = `${hash_name}${ext}`;

    console.log('============>>hash func end <<===========');
    console.log(hashName)
    
    return hashName
}

module.exports = mediaUpload;