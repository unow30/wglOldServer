/**
 * Created by hyunhunhwang on 2020. 12. 21.
 *
 * @swagger
 * /api/public/dev/test:
 *   get:
 *     summary: Dev test api
 *     tags: [Dev]
 *     description: |
 *       path : /api/public/_ev/test
 *
 *       * test api
 *
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           type: object
 *           properties:
 *             method:
 *               type: string
 *               description: api 요청 method
 *             url:
 *               type: string
 *               description: api 요청 url 경로
 *           example:
 *              method: POST
 *              url: /api/example
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const paramUtil = require('../../../common/utils/legacy/origin/paramUtil');
const fileUtil = require('../../../common/utils/legacy/origin/fileUtil');
const mysqlUtil = require('../../../common/utils/legacy/origin/mysqlUtil');
const sendUtil = require('../../../common/utils/legacy/origin/sendUtil');
const errUtil = require('../../../common/utils/legacy/origin/errUtil');
const logUtil = require('../../../common/utils/legacy/origin/logUtil');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        // req.innerBody = {'success':'true'};
        // sendUtil.sendSuccessPacket(req, res, req.innerBody, true);




        checkParam(req);
        //
        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};
            req.innerBody['item'] = await querySelect(req, db_connection);

            // console.log(req.innerBody['item']);
            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        } );

    }
    catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

/**
 * 변수 체크
 * @param req
 */
function checkParam(req) {

}


/**
 * query
 * @param req
 * @param db_connection
 */
function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    //let user_uid = req.headers['user_uid'] ? req.headers['user_uid'] : 0;

    return mysqlUtil.querySingle(db_connection
        , 'call _dev_____proc_select_user_list'
        , [
            // '1',
            // '2',
            // '3',
        ]
    );
}

