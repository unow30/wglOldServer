/**
 * Created by gunucklee on 2021. 08. 22.
 */
const aligoapi = require('aligoapi');
const sendUtil = require("./sendUtil");
const axios = require('axios');


let AuthData = {
    // apikey: `${process.env.ALIGO_APPLICATION_ID}`,
    apikey: `sb3avatbu0n7xclzixl3ogtut4u1rm8v`,
    // 이곳에 발급받으신 api key를 입력하세요
    // userid: `${process.env.ALIGO_USER_ID}`,
    userid: `weggletalk`,
    // 이곳에 userid를 입력하세요
    // token: ''
    // 이곳에 token api로 발급받은 토큰을 입력하세요
}

module.exports = {
    createToken : async function(req, res){
        console.log('createToken AuthData check', AuthData)
        console.log('createToken req.body check', req.body)
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
        console.log('alimSend AuthData check', AuthData)
        console.log('alimSend req.body check', req.body)
        return await aligoapi.alimtalkSend(req, AuthData)
            .then((r) => {
                console.log("scueisjecisj123102j" + JSON.stringify(AuthData));
                console.log("scueisjecisj" + JSON.stringify(r));
                // res.send(r)
            })
            .catch((e) => {
                console.log("wefweferrrororororor")
                res.send(e);
                // sendUtil.sendErrorPacket(req, res, e);
            })
    },
    smsSend : async function(req) {
        AuthData = {
            key: `${process.env.ALIGO_APPLICATION_ID}`,
            // 이곳에 발급받으신 api key를 입력하세요
            userid: `${process.env.ALIGO_USER_ID}`,
            // 이곳에 userid를 입력하세요
            // token: ''
            // 이곳에 token api로 발급받은 토큰을 입력하세요
        }

        return await aligoapi.send(req, AuthData)
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
