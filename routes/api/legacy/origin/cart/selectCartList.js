/**
 * Created by hyunhunhwang on 2021. 01. 25.
 *
 * @swagger
 * /api/private/cart/list:
 *   get:
 *     summary: 장바구니 목록
 *     tags: [Cart]
 *     description: |
 *       ### path : /api/private/cart/list
 *
 *       ### * 장바구니 목록
 *       ### * influencer_gongu_cart: 인플루언서 공구 장바구니
 *       ### * common_cart: 일반상품 장바구니
 *       ### * count_total: 장바구니에 담긴 상품+옵션별 개수 카운트
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
        req.innerBody = {
          item: {
            influencer_gongu_cart: [],
            common_cart: [],
            total_count: 0,
          },
        };

        // let count_data = await querySelectTotalCount(req, db_connection);
        // req.innerBody["item"] = await querySelect(req, db_connection);
        // if (req.innerBody["item"]) {
        //   for (let idx in req.innerBody["item"]) {
        //     req.innerBody["item"][idx]["cart_product_list"] = JSON.parse(
        //       req.innerBody["item"][idx]["cart_product_list"],
        //     );
        //   }
        // }
        let cartList = await querySelect(req, db_connection);

        if (cartList) {
          for (let idx in cartList) {
            cartList[idx]["cart_product_list"] = JSON.parse(
              cartList[idx]["cart_product_list"],
            );
            req.innerBody["item"]["total_count"] +=
              cartList[idx]["cart_product_list"].length;

            if (cartList[idx]["is_influencer"] === 1) {
              req.innerBody["item"]["influencer_gongu_cart"].push(
                cartList[idx],
              );
            } else {
              req.innerBody["item"]["common_cart"].push(cartList[idx]);
            }
          }
        }
        // req.innerBody['total_count'] = count_data['total_count'];

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

function querySelect(req, db_connection) {
  const _funcName = arguments.callee.name;

  return mysqlUtil.queryArray(db_connection, "call proc_select_cart_list", [
    req.headers["user_uid"],
    // req.paramBody['last_uid'],
  ]);
}

function querySelectTotalCount(req, db_connection) {
  const _funcName = arguments.callee.name;

  return mysqlUtil.querySingle(
    db_connection,
    "call proc_select_cart_total_count",
    [req.headers["user_uid"]],
  );
}
