const funcUtil = require('./funcUtil').getNaverUserInformation();
const request = require('request');

class naverAPI {
    constructor(query){
        this.Options = {
            url: `https://openapi.naver.com/v1/search/shop.json?query=${encodeURI(query)}&display=10&sort=sim`,
            headers: {'X-Naver-Client-Id': funcUtil.naverId, 'X-Naver-Client-Secret': funcUtil.naverPw}
        };
    }
    request(op){
        return new Promise((res, rej)=>{
            request.get(op, (err, response, body)=>{
                if(!err){
                    res(body)
                }
                else{
                    rej(err)
                }
            })
        })
    }
    async result(){
        const naverProduct = await this.request(this.Options);

        return await JSON.parse(naverProduct)
    }
}

module.exports = naverAPI