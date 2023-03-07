/**
 * Created by jongho
 *
 * 
 * @swagger
 * /api/private/v2/challenge/detail/list:
 *   get:
 *     summary: 챌린지 디테일 리스트
 *     tags: [Challenge]
 *     description: |
 *       path : /api/private/v2/challenge/detail/list
 *
 *       * 챌린지 디테일 리스트
 *       * limit 12씩 이므로 offset 12씩 증가
 *       * offset 0 일때만 랭킹 데이터 보냄
 *       * 마감이 안된 챌린지는 랭킹 데이터 빈배열 반환
 *
 *     parameters:
 *       - in: query
 *         name: challenge_uid
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           챌린지 uid
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           12씩 증가
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const paramUtil = require('../../../../../common/utils/paramUtil');
const fileUtil = require('../../../../../common/utils/fileUtil');
const mysqlUtil = require('../../../../../common/utils/mysqlUtil');
const sendUtil = require('../../../../../common/utils/sendUtil');
const errUtil = require('../../../../../common/utils/errUtil');
const logUtil = require('../../../../../common/utils/logUtil');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            if(req.paramBody['offset'] == 0){
                const rankingList = await querySelectRanking(req, db_connection);
                req.innerBody['ranking_review'] = productParse(rankingList)
            }
            const challengeList = await querySelect(req, db_connection);
            req.innerBody['item'] = productParse(challengeList)

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
    paramUtil.checkParam_noReturn(req.paramBody, 'offset');
    paramUtil.checkParam_noReturn(req.paramBody, 'challenge_uid');
}

function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_challenge_video_list_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['challenge_uid'],
            req.paramBody['offset'],
        ]
    );
}

function querySelectRanking(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_challenge_video_ranking_list_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['challenge_uid'],
            req.paramBody['offset'],
        ]
    );
}

function productParse(challengeList) {
    return challengeList.map(item=>{
        const result = {
            ...item
        }
        if(item.multiple_product == 1){
            result['product_info'] = item.product_info.split('@!@').map(el => JSON.parse(el))
        }
        else{
            result['product_info'] = [JSON.parse(item.product_info)]
        }
        
        return result
    })
}