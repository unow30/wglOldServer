/**
 * Created by yunhokim
 *
 * @swagger
 * /api/public/v3/searchview/brand/list/all:
 *   get:
 *     summary: 모아보기 브랜드관 탭 정보 불러오기
 *     tags: [v3SearchView]
 *     description: |
 *      ## path : /api/public/v3/searchview/brand/list/all:
 *
 *       * ## 모아보기 브랜드관 탭 정보 불러오기
 *       * ## 브랜드관 카드이미지 정보와 브랜드관 user_uid를 불러온다.
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */
const paramUtil = require("../../../../common/utils/legacy/origin/paramUtil");
const fileUtil = require("../../../../common/utils/legacy/origin/fileUtil");
const mysqlUtil = require("../../../../common/utils/legacy/origin/mysqlUtil");
const sendUtil = require("../../../../common/utils/legacy/origin/sendUtil");
const errUtil = require("../../../../common/utils/legacy/origin/errUtil");
const logUtil = require("../../../../common/utils/legacy/origin/logUtil");

let file_name = fileUtil.name(__filename);
module.exports = function (req, res) {
  try {
    req.file_name = file_name;
    logUtil.printUrlLog(
      req,
      `== function start ==================================`,
    );
    req.paramBody = paramUtil.parse(req);

    checkParam(req);

    mysqlUtil.connectPool(
      async function (db_connection) {
        req.innerBody = {};

        //홈 브랜드관 탭 리스트
        req.innerBody["brand"] = await queryBrandList(req, db_connection);

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
  // paramUtil.checkParam_noReturn(req.paramBody, 'product_uid');
  // paramUtil.checkParam_noReturn(req.paramBody, 'latitude');
  // paramUtil.checkParam_noReturn(req.paramBody, 'longitude');
}

function deleteBody(req) {
  // delete req.innerBody['item']['latitude']
  // delete req.innerBody['item']['longitude']
  // delete req.innerBody['item']['push_token']
  // delete req.innerBody['item']['access_token']
}

//브랜드관 새로운 이미지 리스트
function queryBrandList(req, db_connection) {
  return mysqlUtil.queryArray(
    db_connection,
    "call proc_select_searchview_brand_card_list_v3",
    [
      req.headers["user_uid"],
      // req.paramBody['product_uid'],
    ],
  );
}
