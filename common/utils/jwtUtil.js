/**
 * Created by hyunhunhwang on 2020. 12. 22.
 */
const jwt = require('jsonwebtoken');

module.exports = {
    createToken: function(payload, expired='1d'){
        return jwt.sign(
            {
                uid: payload['uid'],
            },
            // payload,
            process.env.JWT_SECURE_KEY,
            {
                /**
                 * 1h : 1시간
                 * 1d : 1일
                 */
                expiresIn: expired
                // expiresIn: '100d'    // (60*60) == 1h
            }
        );
    },

    createPublicToken: function(){
        return jwt.sign(
            {
                uid: process.env.COMMON_USER_UID,
            },
            // payload,
            process.env.JWT_SECURE_KEY
        );
    },

    getPayload: function(token){
        if( token ){
            console.log('token : ' + token);
            console.log('process jwt secure key : ' + process.env.JWT_SECURE_KEY);

            return jwt.verify(token, process.env.JWT_SECURE_KEY);
        }
        return token;

    },

    createAppleClientSecret: function(lat, exp, secretToken){
        // jwt 토큰 생성(es256, apple private key 필요)
        const header = {
            "algorithm": "ES256",
            "keyid": process.env.KEY_ID
        }
        const payload = {
            "iss": process.env.ISS,
            "lat": lat,
            "exp": exp,
            "sub": process.env.SUB,
            "aud": process.env.AUD
        }
        // console.log(header)
        // console.log(payload)
        // console.log(secretToken)
        let token = jwt.sign(payload, secretToken, header)
        console.log(secretToken)
        console.log(token)
        return token

    },
};
