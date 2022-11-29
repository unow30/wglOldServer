/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/weggler/community/post:
 *   put:
 *     summary: 위글러 커뮤니티 게시글 수정
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/community/post
 *
 * 
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           게시글 수정 바디
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - content
 *           properties:
 *             post_uid:
 *               type: number
 *               example: 79
 *               description: |
 *                 게시글 uid
 *             content:
 *               type: string
 *               example: 안녕하세요 반갑습니당당당.
 *               description: 내용
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


let file_name = fileUtil.name(__filename);
module.exports = function (req, res) {
    const _funcName = arguments.callee.name;
    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);
        checkParam(req)

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};
            req.innerBody['item'] = await query(req, db_connection);
            

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
    paramUtil.checkParam_noReturn(req.paramBody, 'post_uid');
    paramUtil.checkParam_noReturn(req.paramBody, 'content');
}

async function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_update_weggler_community_post_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['post_uid'],
            req.paramBody['content'],
        ]
    );
}