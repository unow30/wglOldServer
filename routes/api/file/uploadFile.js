
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
 *       - in: body
 *         name: body
 *         description: |
 *           댓글 작성
 *         schema:
 *           type: object
 *           required:
 *             - video_width
 *             - video_height
 *           properties:
 *             video_width:
 *               type: number
 *               description: |
 *                 영상 파일 업로드 시에 영상 가로 길이
 *             video_height:
 *               type: number
 *               description: |
 *                 영상 파일 업로드 시에 영상 세로 길이
 *
 *           example:
 *             video_width: 1080
 *             video_height: 1920
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


            const video_width = req.paramBody['video_width']
            const video_height = req.paramBody['video_height']
            let final_name = req.file.key;


            console.log("video_width " + req.paramBody['video_width'])
            console.log("video_width " +  req.paramBody['video_height'])

            final_name = mediaConvertUtil(final_name, video_width, video_height);


            // console.log('function ininininininin........................');
            // console.log(`function file key => ${req.file.key}`);

            req.innerBody = {};

            req.innerBody['filename'] = final_name

            if(req.file.key.includes('.mp4')) {
                req.innerBody['thumbnail'] = req.file.key.replace('ConvertSuccess.mp4', 'Thumbnail.0000000.jpg');
            }

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



