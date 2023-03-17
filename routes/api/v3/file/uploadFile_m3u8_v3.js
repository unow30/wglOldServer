/**
 * Created by hyunhunhwang on 2022. 02. 20.
 *
 * @swagger
 * /api/public/v3/file/m3u8:
 *   post:
 *     summary: 파일 업로드 (1개씩만 업로드 가능)
 *     tags: [File]
 *     description: |
 *       ## path : /api/public/v3/file/m3u8
 *
 *       ### * 파일 (이미지,영상) 업로드 (1개씩만 업로드 가능)
 *       ### * 서버에 오직 파일만 올리뒤 파일명을 받는 api
 *       ### * 이미지의 경우 500kb 이하
 *       ### * 영상의 경우 2mb 이하(더 작으면 좋을거 같습니다.)
 *       ### * 캡쳐할 화면의 초를 전달하면 0초대 화면 하나 캡쳐, 지정한 초의 화면으로 하나 캡쳐. 소수점 3자리까지 표시해야 한다.
 *       ### * ex) 5.236초대 영상을 캡쳐할 경우, second에 5236을 입력, 7초대 영상 캡쳐시 7000입력
 *
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: |
 *           이미지 or 영상 파일
 *       - in: query
 *         name: second
 *         schema:
 *           type: number
 *           example: 1000
 *         description: |
 *           쿼리 파라미터로 보낸다. ex: {api}/?second=1000
 *           second: 1000 => 1초대 화면 캡쳐된다.
 *           5.236초대 영상을 캡쳐할 경우, second에 5236을 입력, 7초대 영상 캡쳐시 7000입력
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/FileApi'
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

const sendUtil = require('../../../../common/utils/legacy/origin/sendUtil');
const paramUtil = require('../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../common/utils/legacy/origin/fileUtil');
const errUtil = require('../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../common/utils/legacy/origin/logUtil');
const errCode = require('../../../../common/define/errCode');
const funcUtil = require('../../../../common/utils/legacy/origin/funcUtil');
const mediaConvertUtil = require('../../../../common/utils/v3/mediaConvertUtil_m3u8_v3');

const s3 = new AWS.S3({
    accessKeyId: funcUtil.getAWSAccessKeyID(),
    secretAccessKey: funcUtil.getAWSSecretAccessKey(),
    region : funcUtil.getAWSRegion(),
});

let file_name = fileUtil.name(__filename);

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
        console.log(req.query.second)

        console.log('upload file awsS3 function start........................');
        if( req.file ) {

            let final_name = req.file.key;

            console.log('finalname: ' + final_name);
            req.innerBody = {};

            if(req.file.originalname.includes('.mp4')) {
                let file_size = req.file.size / (1024 * 1024);
       
                const file_dimensions = await getMediaDimensions(`${funcUtil.getFilePath()}${req.file.key}`, 'video');

                //second 검증
                let second = req.query.second !== 0? req.query.second : 0
                console.log(second)

                final_name = mediaConvertUtil(file_size, final_name, file_dimensions['width'], file_dimensions['height'], second);

                //second대 숫자를 thumbnail이름으로 저장할 수 없을까?
                req.innerBody['thumbnail'] = final_name.replace('ConvertSuccess.m3u8', file_dimensions['duration'] >= 4? 'Thumbnail.0000001.jpg' : 'Thumbnail.0000000.jpg');
            }
            
            req.innerBody['filename'] = final_name

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
        console.log(`===>>> catch e.message: ${e.message}`);
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}
