/**
 * Created by jongho
 *
 * @swagger
 * /api/private/v2/weggler/community/best/post/all:
 *   get:
 *     summary: 커뮤니티 인기게시글 리스트
 *     tags: [Weggler]
 *     description: |
 *      ## path : /api/private/v2/weggler/community/best/post/all
 *
 *       * 커뮤니티 인기게시글 리스트
 *       * limit 15 이므로 offset 15씩 증가
 *       * 전체보기 최대 limit 60, (공구해요, 알려줘요) 각 인기 30위까지만 노출이므로 최대 limit30
 *       * 전체보기 마지막 offset 45, (공구해요, 알려줘요) 마지막 offset 15
 * 
 *     parameters:
 *       - in: query
 *         name: type
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           전체 게시물: 0, 알려줘요: 1, 궁금해요: 2
 *       - in: query
 *         name: offset
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           offset
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

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};
        
            if((req.paramBody.type == 0 && req.paramBody.offset > 45) || //전체보기의 경우 60개까지만 노출 됨으로 offset 45가 마지막
            (req.paramBody.type != 0 && req.paramBody.offset > 15) ){ //타입이 있을경우 30개까지만 노출 됨으로 offset 15가 마지막
                
                const err = new Error('인기 게시글은 전체보기 최대 60개, (알려줘요, 공구해요)는 최대 30개 까지 불러올 수 있습니다.')
                sendUtil.sendErrorPacket(req, res, err);

                return
            }
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

async function query(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.queryArray(db_connection
        , 'call proc_weggler_community_best_post_all_v2'
        , [
            req.headers['user_uid'],
            req.paramBody['type'],
            req.paramBody['offset'],
        ]
    );
}