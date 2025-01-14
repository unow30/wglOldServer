/**
 *
 * @swagger
 * /api/private/v2/file/reward/info/image:
 *   post:
 *     summary: 신분증 or 통장사본 이미지 업로드
 *     tags: [File]
 *     description: |
 *       path : /api/private/v2/file/reward/info/image
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
const sendUtil = require('../../../../../common/utils/legacy/origin/sendUtil');
const paramUtil = require('../../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../../common/utils/legacy/origin/fileUtil');
const errUtil = require('../../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../../common/utils/legacy/origin/logUtil');
const errCode = require('../../../../../common/define/errCode');

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