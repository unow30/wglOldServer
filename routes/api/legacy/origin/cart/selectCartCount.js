/**
 * Created by hyunhunhwang on 2021. 01. 25.
 *
 * @swagger
 * /api/private/cart/count:
 *   get:
 *     summary: 장바구니 상품 개수
 *     tags: [Cart]
 *     description: |
 *       ### path : /api/private/cart/count
 *
 *       ### * 장바구니 장바구니 상품 개수
 *       ### * total_count: 장바구니에 담긴 상품+옵션별 상품종류 개수 카운트(상품별 count가 아님)
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const paramUtil = require("../../../../../common/utils/legacy/origin/paramUtil");
const fileUtil = require("../../../../../common/utils/legacy/origin/fileUtil");
const mysqlUtil = require("../../../../../common/utils/legacy/origin/mysqlUtil");
const sendUtil = require("../../../../../common/utils/legacy/origin/sendUtil");
const errUtil = require("../../../../../common/utils/legacy/origin/errUtil");
const logUtil = require("../../../../../common/utils/legacy/origin/logUtil");

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
  const _funcName = arguments.callee.name;

  try {
    req.file_name = file_name;
    logUtil.printUrlLog(
      req,
      `== function start ==================================`,
    );
    req.paramBody = paramUtil.parse(req);
    // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

    checkParam(req);

    mysqlUtil.connectPool(
      async function (db_connection) {
        req.innerBody = {};

        req.innerBody["item"] = await querySelectCount(req, db_connection);

        deleteBody(req);
        sendUtil.sendSuccessPacket(req, res, req.innerBody, true);
      },
      function (err) {
        sendUtil.sendErrorPacket(req, res, err);
      },
    );
  } catch (e) {
    let _err = errUtil.get(e);
    sendUtil.sendErrorPacket(req, res, _err);
  }
};

function checkParam(req) {
  // paramUtil.checkParam_noReturn(req.paramBody, 'last_uid');
}

function deleteBody(req) {
  // delete req.innerBody['item']['latitude']
  // delete req.innerBody['item']['longitude']
  // delete req.innerBody['item']['push_token']
  // delete req.innerBody['item']['access_token']
}

function querySelectCount(req, db_connection) {
  const _funcName = arguments.callee.name;

  return mysqlUtil.querySingle(db_connection, "call proc_select_cart_count", [
    req.headers["user_uid"],
    // req.paramBody['last_uid'],
  ]);
}
