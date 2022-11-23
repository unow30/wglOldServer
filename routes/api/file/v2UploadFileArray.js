/**
 * Created by jongho on 2022. 11. 22.
 *
 * @swagger
 * /api/private/v2/upload/files:
 *   post:
 *     summary: 파일 업로드 비디오, 이미지 구분없이 6개
 *     tags: [File]
 *     description: |
 *       path : /api/private/v2/upload/files
 *
 *       * 파일 (비디오, 이미지) 업로드 (6개까지 업로드 가능)
 *       * 서버에 오직 파일만 올리뒤 파일명을 받는 api
 *       * nginx body 전체 용량 300mb 입니다!
 *       * 확장자 jpg, jpeg, png, gif, mp4 파일만 가능
 *
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: |
 *           이미지
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           type: object
 *           properties:
 *             code:
 *               type: number
 *               description: 에러 코드
 *             message:
 *               type: string
 *               description: 에러 메세지
 *             method:
 *               type: string
 *               description: api 요청 method
 *             url:
 *               type: string
 *               description: api 요청 url 경로
 *
 *           example:
 *             code: 400
 *             message: 로그인에 실패하였습니다.
 *             method: POST
 *             url: /api/example
 *
 *
 */
const AWS = require("aws-sdk");
const sharp = require('sharp')
const getMediaDimensions = require('get-media-dimensions');

const mediaConvertUtil = require('../../../common/utils/mediaConvertUtil_m3u8');
const sendUtil = require('../../../common/utils/sendUtil');
const paramUtil = require('../../../common/utils/paramUtil');
const fileUtil = require('../../../common/utils/fileUtil');
const errUtil = require('../../../common/utils/errUtil');
const logUtil = require('../../../common/utils/logUtil');
const errCode = require('../../../common/define/errCode');
const funcUtil = require('../../../common/utils/funcUtil');

let file_name = fileUtil.name(__filename);

const s3 = new AWS.S3({
    accessKeyId: funcUtil.getAWSAccessKeyID(),
    secretAccessKey: funcUtil.getAWSSecretAccessKey(),
    region : funcUtil.getAWSRegion(),
});

/**
 * 결과 값을 처리하기 위한 - 전역 변수
 */
module.exports = async function (req, res) {
    const _funcName = arguments.callee.name;
    console.log('afiowekfoik: ' + req.file_name);
    logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
    try {
        req.file_name = file_name;
        req.paramBody = paramUtil.parse(req);

        if(req.files){
            console.log(req.files)
            console.log('넘어옴1')
            const asyncData = req.files.map(async result =>{
                console.log(result.contentType,'map 안')
                const contentType = result.contentType.split('/')[0] 
                if(contentType == 'image'){
                    console.log('이미지 안')
                    const params = {
                        Bucket: result.bucket,
                        Key: result.key
                    }

                    const image = await s3.getObject(params).promise()                    
                    const resizeImage = await sharp(image.Body).resize().withMetadata().toFormat('jpg', { quality: 80 }).toBuffer()

                    params.ACL = 'public-read'
                    params.Body = resizeImage
                    await s3.putObject(params).promise()

                    return {
                        filename: result.key,
                        thumbnail: result.key,
                        type: 2
                    }
                }
                else if(contentType == 'video'){
                console.log(result.contentType,'비디오 안')
                const fileSize = result.size / (1024 * 1024);
                console.log('되었다1',`${funcUtil.getFilePath()}${result.key}`)
                const fileDimensions = await getMediaDimensions(`${funcUtil.getFilePath()}${result.key}`, 'video');
                console.log('되었다2')
                const finalName = mediaConvertUtil(fileSize, result.key, fileDimensions['width'], fileDimensions['height']);
                console.log('되었다3')
                const thumbnail = finalName.replace('ConvertSuccess.m3u8', fileDimensions['duration'] >= 4? 'Thumbnail.0000001.jpg' : 'Thumbnail.0000000.jpg');
                console.log('되었다4')
                return {
                        filename: finalName,
                        thumbnail: thumbnail,
                        type: 1
                    }
                }
            })

            const files = await Promise.all(asyncData)
            req.innerBody = {};
            req.innerBody.files = files

            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
        }
        else {
            let _err = errUtil.initError(errCode.empty, '이미지 파일이 존재하지 않습니다.');
            sendUtil.sendErrorPacket(req, res, _err);
        }

    }
    catch (e) {
        console.log(`===>>> catch e: ${e}`);
        console.log(`===>>> catch e.stack: ${e.stack}`);
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}