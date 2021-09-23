/**
 * Created by gunucklee on 2021. 09. 09.
 *
 * @swagger
 * /api/private/product/recent/viewed:
 *   delete:
 *     summary: 최근 본 상품 삭제
 *     tags: [Product]
 *     description: |
 *       path : /api/private/product/recent/viewed
 *
 *       * 최근 본 상품 삭제
 *
 *     parameters:
 *       - in: query
 *         name: recent_viewed_uid_list
 *         default: 0
 *         required: true
 *         type: array
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 최근 본 상품 uid
 *       - in: query
 *         name: is_select_all
 *         default: 0
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *         description: 전체 선택 활성화 여부
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/Follow'
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
const jwtUtil = require('../../../common/utils/jwtUtil');

const errCode = require('../../../common/define/errCode');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.file_name = file_name;
        // logUtil.printUrlLog(req, `== function start ==================================`);
        logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
        req.paramBody = paramUtil.parse(req);
        // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};


            console.log("@OIQCJEOI2: " + JSON.stringify(req.paramBody['recent_viewed_uid_list']))
            console.log("@OIQCJEOI1: " + req.paramBody['recent_viewed_uid_list'])

            req.innerBody['delete_result'] = [];

            console.log(Array.isArray(req.paramBody['recent_viewed_uid_list']));



            if(Array.isArray(req.paramBody['recent_viewed_uid_list'])) {

                for( let idx in req.paramBody['recent_viewed_uid_list'] ){

                    req.innerBody['recent_viewed_uid'] = req.paramBody['recent_viewed_uid_list'][idx]

                    if(req.paramBody['is_select_all'] === 0 ) {
                        req.innerBody['item'] = await queryCheck(req, db_connection);

                        if (!req.innerBody['item']) {
                            errUtil.createCall(errCode.empty, `존재하지 않는 최근 본 상품입니다.`)
                            return
                        }

                        await query(req, db_connection)
                    }
                    else if (req.paramBody['is_select_all'] === 1 ) {
                        req.innerBody['delete_array'] += req.paramBody['recent_viewed_uid_list'][idx] + ',';
                    }



                    req.innerBody['delete_result'].push( req.innerBody['item'] )
                }

                req.innerBody['delete_array'].slice(0, -1);

                req.innerBody['delete_result'] = await query2(req, db_connection)

            } else {

                if(req.paramBody['is_select_all'] === 0 ) {

                    req.innerBody['recent_viewed_uid'] = req.paramBody['recent_viewed_uid_list']

                    req.innerBody['item'] = await queryCheck(req, db_connection);

                    if (!req.innerBody['item']) {
                        errUtil.createCall(errCode.empty, `존재하지 않는 최근 본 상품입니다.`)
                        return
                    }

                    await query(req, db_connection)

                    req.innerBody['delete_result'].push( req.innerBody['item'] )
                }
                else if (req.paramBody['is_select_all'] === 1 ) {
                    req.innerBody['delete_array'] = req.paramBody['recent_viewed_uid_list']
                    req.innerBody['delete_result'] = await query2(req, db_connection)
                }

            }


            req.innerBody['success'] = '최근 본 상품 삭제가 완료되었습니다.'


            deleteBody(req)
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

}

function deleteBody(req) {
    delete req.innerBody['item']
    delete req.innerBody['recent_viewed_uid']
}

function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_delete_recent_viewed'
        , [
            req.headers['user_uid'],
            req.innerBody['recent_viewed_uid'],
        ]
    );
}

function query2(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_delete_recent_viewed2'
        , [
            req.headers['user_uid'],
            req.innerBody['delete_array'],
        ]
    );
}


function queryCheck(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_select_recent_viewed_check'
        , [
            req.headers['user_uid'],
            req.innerBody['recent_viewed_uid'],
        ]
    );
}