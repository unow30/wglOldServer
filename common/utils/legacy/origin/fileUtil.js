/**
 * Created by hyunhunhwang on 2020. 12. 21.
 */
module.exports = {
    name: function(filename){
        const __filenameList = filename.split('/');
        return __filenameList[__filenameList.length - 1];
    },
};
