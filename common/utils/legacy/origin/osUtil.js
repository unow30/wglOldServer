/**
 * Created by hyunhunhwang on 2020. 12. 21.
 */
const os = require('os');

module.exports = {

    getIpAddress: function() {
        let infos = os.networkInterfaces();
        let result = '';
        for (let dev in infos) {
            let infoArray = infos[dev];
            for( let idx=0; idx < infoArray.length; ++idx ){
                let details = infoArray[idx];
                if (details.family === 'IPv4' && details.internal === false) {
                    result = details.address;
                }
            }
        }

        return result;
    },

}
