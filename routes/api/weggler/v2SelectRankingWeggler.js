/**
 * Created by jongho
 *
 * @swagger
 * /api/public/v2/weggler/ranking:
 *   get:
 *     summary: 랭킹 위글러 불러오기
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/public/v2/weggler/ranking
 *
 *       * 랭킹 위글러 불러오기
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */
const paramUtil = require('../../../common/utils/paramUtil');
const fileUtil = require('../../../common/utils/fileUtil');
const mysqlUtil = require('../../../common/utils/mysqlUtil');
const sendUtil = require('../../../common/utils/sendUtil');
const errUtil = require('../../../common/utils/errUtil');
const logUtil = require('../../../common/utils/logUtil');
const dateUtil = require('../../../common/utils/dateUtil')


let file_name = fileUtil.name(__filename);
module.exports = function (req, res) {
    const _funcName = arguments.callee.name;
    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);

        mysqlUtil.connectPool(async function (db_connection) {
        req.innerBody = {};

        const lanking_weggler = await queryLankingWeggler(req, db_connection); //핫 위글러 리스트 및 동영상 데이터
        const lanking_weggler_parse = lankingWegglerParse(lanking_weggler);

        // const {month, weekNo} = dateUtil();
        // const date = `${month}${weekNo}`;
   
        req.innerBody['lanking_weggler'] = lanking_weggler_parse;

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
}

function deleteBody(req) {
}

function queryLankingWeggler(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_ranking_weggler_list_v2'
        , [
            req.headers['user_uid'],
            // req.paramBody['product_uid'],
        ]
    );
}

function lankingWegglerParse(lanking_weggler) {
    return lanking_weggler.map(item=>{
        return {
            user_uid: item.user_uid,
            amount: item.amount,
            video_count: item.video_count,
            like_count: item.like_count,
            user_profile_image: item.user_profile_image,
            user_nickname: item.user_nickname,
            video_info: item.video_info? item.video_info.split('@!@').map(info_item=> JSON.parse(info_item)) : []
        }
    })
}