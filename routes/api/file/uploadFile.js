
/**
 * Created by hyunhunhwang on 2020. 12. 29.
 *
 * @swagger
 * /api/public/file:
 *   post:
 *     summary: 파일 업로드 (1개씩만 업로드 가능)
 *     tags: [File]
 *     description: |
 *       path : /api/public/file
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
 *           type: object
 *           properties:
 *             method:
 *               type: string
 *               description: api 요청 method
 *             url:
 *               type: string
 *               description: api 요청 url 경로
 *           example:
 *              method: POST
 *              url: /api/example
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

const mediaConvertUtil = require('../../../common/utils/mediaConvertUtil');

let file_name = fileUtil.name(__filename);

/**
 * 결과 값을 처리하기 위한 - 전역 변수
 */
module.exports = async function (req, res) {
    const _funcName = arguments.callee.name;

    logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
    try {
        req.file_name = file_name;
        req.paramBody = paramUtil.parse(req);

        checkParam(req);

        console.log('upload file awsS3 function start........................');
        if( req.file ) {

            let final_name = req.file.key;
            let originalname = req.file.originalname;

            req.innerBody = {};


            if(req.file.originalname.includes('.mp4')) {
                final_name = replaceName(req.file.key);

                let originalnameArray = originalname.split("_")

                console.log("uploadfile: " + originalnameArray)

                let video_width = originalnameArray[originalnameArray.length -2];
                let video_height = originalnameArray[originalnameArray.length -1];
                video_height = video_height.replace('.mp4', '');

                console.log("uploadfile: " + video_width)
                console.log("uploadfile: " + video_height)

                final_name = mediaConvertUtil(final_name, video_width, video_height);

                console.log("finalname mediaconvert :" + final_name)

                req.innerBody['thumbnail'] = final_name.replace('ConvertSuccess.mp4', 'Thumbnail.0000000.jpg');
            }

            req.innerBody['filename'] = final_name

            console.log('here filename: ' + req.innerBody['filename'])

            // req.innerBody['thumbnail'] = thumbnail_name

            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
        }
        else {
            // sendUtil.sendErrorMsg( errCode.empty, '이미지 파일이 존재하지 않습니다.');
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

function checkParam(req) {
    // paramUtil.checkParam_noReturn(req.paramBody, 'code');
    // paramUtil.checkParam_noReturn(req.paramBody, 'target_uid');
}



function replaceName(filename) {

    let fileArray = filename.split("_")
    filename =filename.replace('_'+ fileArray[fileArray.length -2], '')

    filename =filename.replace('_' + fileArray[fileArray.length -1], '')

    return filename;
}