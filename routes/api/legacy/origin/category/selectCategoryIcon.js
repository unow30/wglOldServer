/**
 * Created by yunhokim on 2023. 01. 20.
 *
 * @swagger
 * /api/public/v2/category/icon:
 *   get:
 *     summary: 카테고리 이름 아이콘 목록
 *     tags: [Category]
 *     description: |
 *       path : /api/public/v2/category/icon
 *
 *       * 카테고리 이름 아이콘 목록
 *       * 하위 카테고리 정보도 전달
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

            let category_data = await queryCategory(req, db_connection);
            req.innerBody['item'] = categoryParse(category_data);


            // req.innerBody['item'] = await queryVideo(req, db_connection);

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
    // paramUtil.checkParam_noReturn(req.paramBody, 'category');
}

function deleteBody(req) {
    // delete req.innerBody['item']['latitude']
    // delete req.innerBody['item']['longitude']
    // delete req.innerBody['item']['push_token']
    // delete req.innerBody['item']['access_token']
}

function queryCategory(req, db_connection){
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_category_list_v2'
        , [
        ]
    );
}
function categoryParse(category) {
    let res = category.map(el =>{
        el['sub_category_list'] = el['sub_category_list']? el['sub_category_list'].split('@!@').map(ele => JSON.parse(ele)) : []
        return el
    })
    return res
}

