/**
 * Created by hyunhunhwang on 2021. 01. 08.
 *
 * @swagger
 * /api/public/auth/token:
 *   get:
 *     summary: public token 발급
 *     tags: [Auth]
 *     description: |
 *       path : /api/auth/public/token
 *
 *       * public token 발급
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: asdklasdmklwmdkalsdjmkawmklsad
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
const fcmUtil = require('../../../common/utils/fcmUtil');

const errCode = require('../../../common/define/errCode');

let file_name = fileUtil.name(__filename);

const createToken = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        req.innerBody = {};

        req.innerBody['token'] = jwtUtil.createPublicToken();

        return sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

    }
    catch (e) {
        let _err = errUtil.get(e);
        return sendUtil.sendErrorPacket(req, res, _err);
    }
}
module.exports = {
    createToken,
}
