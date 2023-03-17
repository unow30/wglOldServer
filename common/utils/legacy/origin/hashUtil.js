/**
 * Created by hyunhunhwang on 2020. 12. 22.
 */
const crypto = require('crypto');

module.exports = {

    randomNumber: function(codeLength){
        const chars = "0123456789";
        return randomChars(chars, codeLength);
    },

    randomCode: function(codeLength){
        // const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        return randomChars(chars, codeLength);
    },

    createHash: function (key = null){
        return crypto.createHash('sha256')
            .update( key === null ? Date.now().toString() : key )
            .digest('base64');
    },
};

function randomChars(chars, length) {
    const rnd = crypto.randomBytes(length)
        , value = new Array(length)
        , len = chars.length;

    for (let i = 0; i < length; i++) {
        value[i] = chars[rnd[i] % len]
    }

    return value.join('');
}
