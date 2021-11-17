/**
 * Created by gunucklee on 2021. 08. 22.
 */
const aligoapi = require('aligoapi');
const sendUtil = require("./sendUtil");


let AuthData = {
    apikey: `${process.env.ALIGO_APPLICATION_ID}`,
    // 이곳에 발급받으신 api key를 입력하세요
    userid: `${process.env.ALIGO_USER_ID}`,
    // 이곳에 userid를 입력하세요
    // token: ''
    // 이곳에 token api로 발급받은 토큰을 입력하세요
}

module.exports = {
    createToken : async function(req, res){
        return  await aligoapi.token(req, AuthData)
            .then((r) => {
                console.log("token result: " + JSON.stringify(r));
                AuthData['token'] = r['token'];

                console.log("resultewo : " + AuthData['token'])
                // res.send(r)
            })
            .catch((e) => {
                res.send(e)
            })
    },
    alimSend : async function(req, res) {
        return await aligoapi.alimtalkSend(req, AuthData)
            .then((r) => {
                console.log("scueisjecisj123102j" + JSON.stringify(AuthData));
                console.log("scueisjecisj" + JSON.stringify(r));
                // res.send(r)
            })
            .catch((e) => {
                console.log("wefweferrrororororor")
                sendUtil.sendErrorPacket(req, res, e);
            })
    }
};
