/**
 * Created by yunhokim
 *
 * @swagger
 * /api/public/v3/searchview/banner/all:
 *   get:
 *     summary: 모아보기 전체 탭 정보 불러오기
 *     tags: [v3SearchView]
 *     description: |
 *      ## path : /api/public/v3/searchview/banner/all
 *
 *       * ## 모아보기 홈배너, 브랜드관 배너 불러오기
 *         * ### 홈배너(홈 탭 클릭시 표시)
 *         * ### 브랜드관 배너(브랜드관 탭 클릭시 표시)
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

        const ad_banner_list = queryADBannerList(req, db_connection); //홈배너광고리스트
        const brand_banner_list = queryBrandBannerList(req, db_connection); //브랜드관배너광고리스트
        const [ad_banner_data, brand_banner_data] = await Promise.all([
          ad_banner_list,
          brand_banner_list,
        ]);

        req.innerBody["ad_banner_list"] = ad_banner_data;
        req.innerBody["brand_banner_list"] = brand_banner_data;

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

//배너광고리스트
function queryADBannerList(req, db_connection) {
  return mysqlUtil.queryArray(
    db_connection,
    "call proc_select_searchview_ad_list_v1",
    [
      req.headers["user_uid"],
      // req.paramBody['product_uid'],
    ],
  );
}

function queryBrandBannerList(req, db_connection) {
  return mysqlUtil.queryArray(
    db_connection,
    "call proc_select_promotion_big_banner_list",
    [
      req.headers["user_uid"],
      // req.paramBody['product_uid'],
    ],
  );
}
