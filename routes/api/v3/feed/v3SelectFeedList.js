

const paramUtil = require('../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../common/utils/legacy/origin/logUtil');


let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);
        logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            let obj = [];

            //type이 0이고 video_uid가 0보다 크면 그 비디오가 피드의 가장 위에 나온다.
            req.innerBody['type'] = 0;
            if(req.paramBody['video_uid'] > 0) {
                obj = await querySelect(req, db_connection); //in_video_uid정보 하나만 있다.
                // req.paramBody['video_uid'] = 0;
                req.innerBody['type'] = 1;
            }

            req.innerBody['item'] = await querySelect(req, db_connection); //type이 1이면 in_video_uid제외한 정보가 있다.

            req.innerBody['item'] = [...obj, ...req.innerBody['item']]; //두 정보 통합, in_video_uid값이 가장 위에 있다.
            // Array.prototype.push.apply(obj, req.innerBody['item']);

            // Object.assign(req.innerBody['item'], obj, req.innerBody['item']);

            deleteBody(req)
            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });

    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function checkParam(req) {
    paramUtil.checkParam_noReturn(req.paramBody, 'latitude');
    paramUtil.checkParam_noReturn(req.paramBody, 'longitude');
    paramUtil.checkParam_noReturn(req.paramBody, 'km');
    paramUtil.checkParam_noReturn(req.paramBody, 'category');
    // paramUtil.checkParam_noReturn(req.paramBody, 'ad_product_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'random_seed');
    paramUtil.checkParam_noReturn(req.paramBody, 'offset');



    if(!paramUtil.checkParam_return(req.paramBody, 'keyword')){
        req.paramBody['keyword'] = null
    }
    if(!paramUtil.checkParam_return(req.paramBody, 'tag')){
        req.paramBody['tag'] = null
    }
    if(!paramUtil.checkParam_return(req.paramBody, 'select_type')){
        //select_type을 전달 안한다면 all을 기본값으로 한다.
        req.paramBody['select_type'] = 'all'
        // req.paramBody['select_type'] = req.paramBody['select_type'] ?? 'all'랑 같다.
    }

}

function deleteBody(req) {
    for( let idx in req.innerBody['item'] ){
        delete req.innerBody['item'][idx]['filename']
    }

    delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    switch(req.paramBody['select_type']){
        case 'all':{
            return mysqlUtil.queryArray(db_connection
                , 'call proc_select_feed_list_v1'
                , [
                    req.headers['user_uid'],
                    req.paramBody['latitude'],
                    req.paramBody['longitude'],
                    req.paramBody['km'],
                    req.paramBody['category'],
                    req.paramBody['video_uid'],
                    // req.paramBody['keyword'], //v1에서 안쓴다.
                    req.paramBody['random_seed'],
                    req.paramBody['offset'],
                    req.paramBody['tag'],
                    req.innerBody['type'],
                    req.paramBody['filter'],
                ]
            );
        }break
        case 'brand':{
            return mysqlUtil.queryArray(db_connection
                , 'call proc_select_feed_brand_list_v1'
                , [
                    req.headers['user_uid'],
                    req.paramBody['latitude'],
                    req.paramBody['longitude'],
                    req.paramBody['km'],
                    req.paramBody['category'],
                    req.paramBody['video_uid'],
                    // req.paramBody['keyword'], //v1에서 안쓴다.
                    req.paramBody['random_seed'],
                    req.paramBody['offset'],
                    req.paramBody['tag'],
                    req.innerBody['type'],
                    req.paramBody['filter'],
                ]
            );
        }break;
        case 'groupbuying':{
            //공구쪽 영상에 상품 여러개 표시? 이전꺼 실행하고 방안 찾기
            //필터링하기? 이전꺼 실행하고 방안 찾기
            return mysqlUtil.queryArray(db_connection
                , 'call proc_select_gongu_feed_list_v1'
                , [
                    req.headers['user_uid'],
                    req.paramBody['random_seed'],
                    req.paramBody['offset'],
                    req.paramBody['filter'],
                    req.paramBody['category'],
                ]
            );
        }break;
        case 'challenge':{
            return mysqlUtil.queryArray(db_connection
                , 'call proc_select_challenge_feed_list_v2'
                , [
                    req.headers['user_uid'],
                    req.paramBody['latitude'],
                    req.paramBody['longitude'],
                    req.paramBody['km'],
                    req.paramBody['random_seed'],
                    req.paramBody['offset'],
                    req.paramBody['target_uid'],
                ]
            );
        }break;
        case 'favorite':{
            return mysqlUtil.queryArray(db_connection
                , 'call proc_select_feed_recommend_list_v3'
                , [
                    req.headers['user_uid'],
                    req.paramBody['latitude'],
                    req.paramBody['longitude'],
                    req.paramBody['km'],
                    // req.paramBody['category'],
                    req.paramBody['video_uid'],
                    // req.paramBody['keyword'], //v1에서 안쓴다.
                    req.paramBody['random_seed'],
                    req.paramBody['offset'],
                    req.paramBody['tag'],
                    req.innerBody['type'],
                    // req.paramBody['filter'],

                ]
            );
        }
        // case 'groupbuying':{
        //     return mysqlUtil.queryArray(db_connection
        //         , 'call proc_select_feed_groupbuying_list_v1'
        //         , [
        //             req.headers['user_uid'],
        //             req.paramBody['latitude'],
        //             req.paramBody['longitude'],
        //             req.paramBody['km'],
        //             req.paramBody['category'],
        //             req.paramBody['video_uid'],
        //             // req.paramBody['keyword'], //v1에서 안쓴다.
        //             req.paramBody['random_seed'],
        //             req.paramBody['offset'],
        //             req.paramBody['tag'],
        //             req.innerBody['type'],
        //             req.paramBody['filter'],
        //         ]
        //     );
        // }break;
        // case 'recent':{
        //     return mysqlUtil.queryArray(db_connection
        //         , 'call proc_select_feed_recent_video_list'
        //         , [
        //             req.headers['user_uid'],
        //             req.paramBody['video_uid'],
        //             req.paramBody['category'],
        //             req.paramBody['random_seed'],
        //             req.paramBody['offset'],
        //             req.innerBody['type'],
        //         ]
        //     );
        // }break;
        // case 'weggledeal':{
        //     return mysqlUtil.queryArray(db_connection
        //         , 'call proc_select_feed_weggledeal_list_v1'
        //         , [
        //             req.headers['user_uid'],
        //             req.paramBody['video_uid'],
        //             req.paramBody['category'],
        //             req.paramBody['random_seed'],
        //             req.paramBody['offset'],
        //             req.innerBody['type'],
        //         ]
        //     );
        // }break;
    }
}