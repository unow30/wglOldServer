/**
 * Created by yunhokim on 2022. 09. 27.
 *
 * @swagger
 * /api/public/order/cancel:
 *   put:
 *     summary: 부트페이 에러 취소
 *     tags: [Order]
 *     description: |
 *       path : /api/public/order/cancel
 *
 *       * 부트페이 에러 취소
 *       * post /private/order 실행 실패시 부트페이 결제내역 전체 취소하기
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           상품 구매
 *
 *         schema:
 *           type: object
 *           properties:
 *             pg_receipt_id:
 *               type: string
 *               example: 124ndfgpo12lzxv
 *               description: |
 *                 부트페이 receipt_id
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const paramUtil = require('../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../common/utils/legacy/origin/logUtil');
const moment = require('moment');

let file_name = fileUtil.name(__filename);

const errCode = require('../../../../common/define/errCode');

const RestClient = require('@bootpay/server-rest-client').RestClient;

/**
 * api/private/order 결제정보 저장하기가 실패했을때 부트패이 결제내역을 전체취소한다.
 * 기존 bootpay.js에서 해결하고 싶지만 결제취소정보 관련 로직이 너무 많아서 불편하다.
 * 추후에 결제로직 전반을 수정할 때 취소기능을 통합한다.
 *
 */
module.exports =  function (req, res, next) {

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);
        console.log('param: ',req.paramBody)

        req.innerBody = {};
        RestClient.setConfig(
            process.env.BOOTPAY_APPLICATION_ID,
            process.env.BOOTPAY_PRIVATE_KEY,
        );

        RestClient.getAccessToken().then(function (token) {
            try {
                console.log('token.status: ',token.status)
                if (token.status === 200) {
                    RestClient.cancel({
                        receiptId: req.paramBody['pg_receipt_id'],
                        // price: 0,//속성값을 안주면 전체취소
                        name: '위글결제에러결제취소', //취소자명: 토큰을 잃으면 알수없으니 위글에러취소라 정함.
                        reason: '위글결제에러결제취소'
                    }).then(function (response) {
                        // 결제 취소가 완료되었다면
                        if (response.status === 200) {
                            console.log(JSON.stringify(response));
                            console.log("부트페이 성공..!!!");
                            req.innerBody['is_success'] = 'OK'
                            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
                        }
                    }).catch((e) => {
                        console.log(e)
                        sendUtil.sendErrorPacket(req, res, errUtil.initError(e.status, `결제가 실패했습니다. 고객센터에 문의해주세요.`));
                        return;
                    });
                }
            } catch (e) {
                let _err = errUtil.get(e);
                sendUtil.sendErrorPacket(req, res, _err);
            }
        });
    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }

}
