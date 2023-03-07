/**
 * Created by hyunhunhwang on 2021. 10. 13.
 *
 * @swagger
 * /api/public/video/hashTag/list:
 *   get:
 *     summary: 영상 해시태그 목록
 *     tags: [Video]
 *     description: |
 *       path : /api/public/video/hashTag/list
 *
 *       * 영상 해시태그 목록
 *
 *     parameters:
 *       - in: query
 *         name: video_uid
 *         required: true
 *         default: 0
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           영상 uid
 *           * 영상이 없을 경우 0
 *       - in: query
 *         name: random_seed
 *         required: true
 *         schema:
 *           type: string
 *           example: 133q1234
 *         description: |
 *           검색할 때 필요한 랜덤 시드입니다.
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           페이지 시작 값을 넣어주시면 됩니다. Limit 30
 *           offset 0: 0~30
 *           offset 30: 30~60
 *           offset 60: 60~90
 *       - in: query
 *         name: tag
 *         required: false
 *         schema:
 *           type: string
 *           example: 핸드폰
 *         description: |
 *           해시태그 (영상 기준)
 *           * "핸드폰" 과 같이 #이 붙은 것만 검색됨
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/Feed'
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
        logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

        checkParam(req);

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            let obj = [];

            req.innerBody['type'] = 0;

            let count = await querySelectTotalCount(req, db_connection);

            if(req.paramBody['video_uid'] > 0 && parseInt(req.paramBody['offset']) === 0) {
                obj = await querySelect(req, db_connection);
                // req.paramBody['video_uid'] = 0;
                req.innerBody['type'] = 1;
            }
            if(parseInt(req.paramBody['offset']) > 0) {
                req.innerBody['type'] = 1;
                req.paramBody['offset'] -= 1;
            }

            req.innerBody['item'] = await querySelect(req, db_connection);

            req.innerBody['item'] = [...obj, ...req.innerBody['item']];
            req.innerBody['total_count'] = count['total_count']
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
    paramUtil.checkParam_noReturn(req.paramBody, 'random_seed');
    paramUtil.checkParam_noReturn(req.paramBody, 'offset');

    if(!paramUtil.checkParam_return(req.paramBody, 'tag')) {
        req.paramBody['tag'] = null
    }
}

function deleteBody(req) {
    for( let idx in req.innerBody['item'] ){
        delete req.innerBody['item'][idx]['filename']
    }
}

function querySelectTotalCount(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
    , 'call proc_select_video_hash_tag_list_count'
        , [
            req.paramBody['tag']
        ]
    );
}



function querySelect(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_select_video_hash_tag_list'
        , [
            req.headers['user_uid'],
            req.paramBody['video_uid'],
            req.paramBody['random_seed'],
            req.paramBody['offset'],
            req.paramBody['tag'],
            req.innerBody['type'],
        ]
    );
}
