/**
 * Created by hyunhunhwang on 2020. 12. 29.
 *
 * @swagger
 * /api/public/file/m3u8:
 *   post:
 *     summary: 파일 업로드 (1개씩만 업로드 가능)
 *     tags: [File]
 *     description: |
 *       path : /api/public/file/m3u8
 *
 *       * 파일 (이미지,영상) 업로드 (1개씩만 업로드 가능)
 *       * 서버에 오직 파일만 올리뒤 파일명을 받는 api
 *       * 이미지의 경우 500kb 이하
 *       * 영상의 경우 2mb 이하(더 작으면 좋을거 같습니다.)
 *
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: file
 *         type: file
 *         description: |
 *           이미지 or 영상 파일
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
const sendUtil = require('../../../common/utils/sendUtil');
const paramUtil = require('../../../common/utils/paramUtil');
const fileUtil = require('../../../common/utils/fileUtil');
const errUtil = require('../../../common/utils/errUtil');
const logUtil = require('../../../common/utils/logUtil');
const errCode = require('../../../common/define/errCode');
const funcUtil = require('../../../common/utils/funcUtil');

// const mediaConvertUtil = require('../../../common/utils/mediaConvertUtil');

const mediaConvertUtil = require('../../../common/utils/mediaConvertUtil_m3u8');

const getMediaDimensions = require('get-media-dimensions');

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

        console.log('upload file awsS3 function start........................');
        if( req.file ) {

            let final_name = req.file.key;

            console.log('finalname: ' + final_name);
            req.innerBody = {};

            if(req.file.originalname.includes('.mp4')) {
                console.log('===========>>조건 처음'+1111111111111111111)
                let file_size = req.file.size / (1024 * 1024);
                console.log('===========>>사이즈 아래'+2222222222222222222)
                console.log('===========>>파일 키'+req.file.key)
                const file_dimensions = await getMediaDimensions(`${funcUtil.getFilePath()}${req.file.key}`, 'video');
                console.log('===========>>미디어 디멘션'+3333333333333333333)
                console.log('===========>>미디어 디멘션치수===>'+file_dimensions['duration'])
                console.log('===========>>미디어 디멘션가로===>'+file_dimensions['width'])
                console.log('===========>>미디어 디멘션세로===>'+file_dimensions['height'])
                final_name = mediaConvertUtil(file_size, final_name, file_dimensions['width'], file_dimensions['height']);
                console.log('===========>>미디어 컨버터 안됨'+4444444444444444444)
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
