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
const path = require('path')

const mediaConvertUtil = require('../../../../../common/utils/legacy/origin/mediaConvertUtil_m3u8');
const sendUtil = require('../../../../../common/utils/legacy/origin/sendUtil');
const paramUtil = require('../../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../../common/utils/legacy/origin/fileUtil');
const errUtil = require('../../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../../common/utils/legacy/origin/logUtil');
const errCode = require('../../../../../common/define/errCode');
const funcUtil = require('../../../../../common/utils/legacy/origin/funcUtil');

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

        if (req.files) {
            console.log(req.files)
            // console.log(`3. v2UploadFileArray 실행:`);
            // console.log(process.memoryUsage());
            const asyncData = req.files.map(async result => {
                const contentType = result.contentType.split('/')[0]
                const ext = path.extname(result.key);

                if (
                    contentType == 'image' ||
                    ext == '.jpg' ||
                    ext == '.JPG' ||
                    ext == '.png' ||
                    ext == '.PNG' ||
                    ext == '.webp' ||
                    ext == '.WEBP' ||
                    ext == '.jpeg' ||
                    ext == '.JPEG' ||
                    ext == '.gif' ||
                    ext == '.GIF'
                ) {

                    return {
                        filename: result.key,
                        thumbnail: result.key,
                        type: 2
                    }
                } else if (
                    contentType == 'video' ||
                    ext == '.mp4' ||
                    ext == '.MP4'
                ) {

                    const fileSize = result.size / (1024 * 1024);
                    const fileDimensions = await getMediaDimensions(`${funcUtil.getFilePath()}${result.key}`, 'video');
                    const finalName = mediaConvertUtil(fileSize, result.key, fileDimensions['width'], fileDimensions['height']);
                    const thumbnail = finalName.replace('ConvertSuccess.m3u8', fileDimensions['duration'] >= 4 ? 'Thumbnail.0000001.jpg' : 'Thumbnail.0000000.jpg');
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
            // console.log(`7. files 전체 전달:${process.memoryUsage()}`);
            // console.log(process.memoryUsage());
            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
        } else {
            let _err = errUtil.initError(errCode.empty, '이미지 파일이 존재하지 않습니다.');
            sendUtil.sendErrorPacket(req, res, _err);
        }

    } catch (e) {
        console.log(`===>>> catch e: ${e}`);
        console.log(`===>>> catch e.stack: ${e.stack}`);
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
    finally {
        resizeImage = null
    }

}