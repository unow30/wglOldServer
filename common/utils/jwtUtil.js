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

    getPayload: function(token){
        if( token ){
            return jwt.verify(token, process.env.JWT_SECURE_KEY);
        }
        return token;

    },
};
