/**
 * Created by hyunhunhwang on 2020. 12. 22.
 */
module.exports = {
    /**
     * Email 형식 검증
     * @param email
     * @returns {boolean}
     */
    validEmail: function (email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
}
