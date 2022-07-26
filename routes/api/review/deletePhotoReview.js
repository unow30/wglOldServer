/**
 *
 * @swagger
 * /api/private/v1/review/photo:
 *   delete:
 *     summary: 상품의 포토리뷰 삭제하기
 *     tags: [Review]
 *     description: |
 *       path : /api/private/v1/review/photo
 *
 *       * 상품 포토리뷰 삭제하기
 *
 *     parameters:
 *       - in: query
 *         name: photo_review_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 1
 *         description: |
 *           상품 포토리뷰 uid
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
const fcmUtil = require('../../../common/utils/fcmUtil');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;
    console.log(1234)
    try{
        req.file_name = file_name;
    //  logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
        req.innerBody = {};

        req.innerBody['item'] = await query(req, db_connection);
        if( req.innerBody['item']['is_deleted'] = 0  ){
            
            return errUtil.createCall(errCode.fail, `삭제에 실패하였습니다.`)
        }
        req.innerBody['is_deleted'] = 1
        req.innerBody['success'] = '삭제가 완료되었습니다.'
        
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

function checkParam(req) {
    paramUtil.checkParam_noReturn(req.paramBody, 'photo_review_uid');
}


function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_delete_photo_review'
        , [
            req.headers['user_uid'],
            req.paramBody['photo_review_uid'],
        ]
    );
}

