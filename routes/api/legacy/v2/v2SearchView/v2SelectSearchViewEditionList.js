/**
 * Created by yunhokim on 2022. 12. 07.
 *
 * @swagger
 * /api/public/v2/searchview/edition/list:
 *   get:
 *     summary: 기획전 리스트 더보기
 *     tags: [v2SearchView]
 *     description: |
 *       path : /api/public/v2/searchview/edition/list
 *
 *       * ## 기획전 리스트 더보기
 *       * ### edition_uid별로 랜덤하게 정렬해서 보낸다.
 *       * ### filename_strip는 edition_uid와 같이 보낸다.
 *
 *     parameters:
 *       - in: query
 *         name: random_seed
 *         required: true
 *         schema:
 *           type: string
 *           example: 133q1234
 *         description: |
 *           검색할 때 필요한 랜덤 시드입니다.
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const paramUtil = require('../../../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../../../common/utils/legacy/origin/logUtil');

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

            let data = await queryEditionList(req, db_connection);
            req.innerBody['item'] = editionParse(data);

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
    // paramUtil.checkParam_noReturn(req.paramBody, 'user_uid');
    // paramUtil.checkParam_noReturn(req.paramBody, 'last_uid');
}

function deleteBody(req) {
}

//기획전 상품 리스트
function queryEditionList(req, db_connection) {
    const _funcName = arguments.callee.name;
    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_searchview_edition_list_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['random_seed'],
        ]
    );
};

function editionParse(edition) {
    return edition.map(item=>{
        return {
            edition_uid: item.edition_uid,
            edition_filename: item.edition_filename_strip,
            edition_filename_strip: item.edition_filename_strip,
            start_time: item.start_time,
            end_time: item.end_time,
            edition_name: item.edition_name,
            edition_list: item.edition_list? item.edition_list.split('@!@').map(info_item=> JSON.parse(info_item)) : []
        }
    })
}