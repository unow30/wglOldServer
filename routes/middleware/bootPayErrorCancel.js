/**
 * Created by yunhokim on 2022. 09. 27.
 */

const paramUtil = require('../../common/utils/paramUtil');
const fileUtil = require('../../common/utils/fileUtil');
const mysqlUtil = require('../../common/utils/mysqlUtil');
const sendUtil = require('../../common/utils/sendUtil');
const errUtil = require('../../common/utils/errUtil');
const logUtil = require('../../common/utils/logUtil');

const errCode = require('../../common/define/errCode');

const RestClient = require('@bootpay/server-rest-client').RestClient;

/**
 * api/private/order 결제정보 저장하기가 실패했을때 부트패이 결제내역을 전체취소한다.
 * 기존 bootpay.js에서 해결하고 싶지만 결제취소정보 관련 로직이 너무 많아서 불편하다.
 * 추후에 결제로직 전반을 수정할 때 취소기능을 통합한다.
 *
 */
module.exports =  function (req, res, next) {
    req.paramBody = paramUtil.parse(req);

    try {
        req.innerBody = {};
        RestClient.setConfig(
            process.env.BOOTPAY_APPLICATION_ID,
            process.env.BOOTPAY_PRIVATE_KEY,
        );

        RestClient.getAccessToken().then(function (token) {
            try {
                if (token.status === 200) {
                    RestClient.cancel({
                        receiptId: req.paramBody['pg_receipt_id'],
                        price: 0,                               //0이면 결제내역 전체취소
                        reason: '결제실패'
                    }).then(function (response) {
                        // 결제 취소가 완료되었다면
                        if (response.status === 200) {
                            console.log(JSON.stringify(response));
                            console.log("부트페이 성공..!!!");
                            res.send("결제가 실패했습니다")
                        }
                    }).catch((e) => {
                        sendUtil.sendErrorPacket(req, res, errUtil.initError(e.path, `결제가 실패했습니다. 고객센터에 문의해주세요.`));
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
