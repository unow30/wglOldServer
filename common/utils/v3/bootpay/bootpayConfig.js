const BootpayV1 = require('@bootpay/server-rest-client').RestClient;
const BootpayV2 = require('@bootpay/backend-js').Bootpay;
const serverCheck = require('../../legacy/origin/funcUtil')

module.exports = {
    setConfigBootpayV1: () => {
        const isReal = serverCheck.isRealServer
        BootpayV1.setConfig(
            isReal? process.env.BOOTPAY_APPLICATION_ID : process.env.DEV_BOOTPAY_APPLICATION_ID,
            isReal? process.env.BOOTPAY_PRIVATE_KEY: process.env.DEV_BOOTPAY_PRIVATE_KEY,
        );

        return BootpayV1
    },

    setConfigBootpayV2: () => {
        const isReal = serverCheck.isRealServer
        BootpayV2.setConfiguration({
            application_id: isReal? process.env.BOOTPAY_APPLICATION_ID : process.env.DEV_BOOTPAY_APPLICATION_ID,
            private_key: isReal? process.env.BOOTPAY_PRIVATE_KEY : process.env.DEV_BOOTPAY_PRIVATE_KEY,
        });
        console.log('v2부트페이 설정 완료')
        return BootpayV2
    }
}