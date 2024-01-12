/**
 *
 * @swagger
 * /api/private/v2/video/review:
 *   post:
 *     summary: 리뷰영상 작성
 *     tags: [Video]
 *     description: |
 *       path : /api/private/v2/video/review
 *
 *       * 리뷰영상 작성
 *       * product_uid = 비디오 리뷰에 들어갈 전체 product uid 예) [1, 2, 3]
 *       * representative_product_uid = 대표가 될 상품 uid 예) 1 => 이 대표상품도 위의 product_uid에 넣어주셔야 합니다.
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           리뷰영상 작성
 *         schema:
 *           type: object
 *           required:
 *             - product_uid
 *             - content
 *             - filename
 *           properties:
 *             product_uid:
 *               type: array
 *               items:
 *                 type: number
 *               example: [100001, 100002, 100003]
 *             content:
 *               type: string
 *               example: 리뷰 내용입니다.
 *               description: 리뷰 내용
 *             representative_product_uid:
 *               type: number
 *               example: 100001
 *               description: 대표 상품 uid
 *             filename:
 *               type: string
 *               example: abcde.mp4
 *               description: |
 *                 영상 파일명
 *                 * /api/public/file api 호출뒤 응답값인 filename 를 사용
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/VideoReviewApi'
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */

const path = require("path");
const paramUtil = require("../../../../../common/utils/legacy/origin/paramUtil");
const fileUtil = require("../../../../../common/utils/legacy/origin/fileUtil");
const mysqlUtil = require("../../../../../common/utils/legacy/origin/mysqlUtil");
const sendUtil = require("../../../../../common/utils/legacy/origin/sendUtil");
const errUtil = require("../../../../../common/utils/legacy/origin/errUtil");
const logUtil = require("../../../../../common/utils/legacy/origin/logUtil");
const fcmUtil = require("../../../../../common/utils/legacy/origin/fcmUtil");

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
  const _funcName = arguments.callee.name;

  try {
    req.file_name = file_name;
    logUtil.printUrlLog(
      req,
      `== function start ==================================`,
    );
    // logUtil.printUrlLog(req, `header: ${JSON.stringify(req.headers)}`);
    req.paramBody = paramUtil.parse(req);
    // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

    checkParam(req);
    console.log(
      "========================>>>>>>>>들어왔다<<<<<<<=======================",
    );
    mysqlUtil.connectPool(
      async function (db_connection) {
        req.innerBody = {};
        console.log(req.paramBody, "=================>>>paramBody");
        const filenameExt = path
          .extname(req.paramBody["filename"])
          .replace(".", "");

        if (filenameExt === "m3u8") {
          req.innerBody["item"] = await query_m3u8(req, db_connection);
          console.log(
            req.innerBody,
            req.headers["user_uid"],
            "============video create 후 스코프 안=============",
          );
        } else {
          req.innerBody["item"] = await query(req, db_connection);
          console.log(
            req.innerBody,
            req.headers["user_uid"],
            "============video create 후 스코프 안=============",
          );
        }

        console.log(
          req.innerBody["item"],
          "============video create 후=============",
        );
        await queryProductBulkInsert(req, db_connection);

        let alertList = await queryAlertComment(req, db_connection);

        if (alertList["is_alert_review_video"] == 0) {
          let fcmReviewVideo = await fcmUtil.fcmReviewVideoSingle(
            req.innerBody["item"],
          );
          console.log('fcmReviewVideo["data"] => ', fcmReviewVideo["data"]);
          if (fcmReviewVideo["data"] !== null) {
            await queryInsertFCM(fcmReviewVideo["data"], db_connection);
          }
        }

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
  paramUtil.checkParam_noReturn(req.paramBody, "product_uid");
  paramUtil.checkParam_noReturn(req.paramBody, "content");
  paramUtil.checkParam_noReturn(req.paramBody, "filename");
}

function deleteBody(req) {
  // delete req.innerBody['item']['latitude']
}

function query(req, db_connection) {
  const _funcName = arguments.callee.name;
  console.log(
    req.headers["user_uid"],
    req.paramBody["representative_product_uid"],
    req.paramBody["content"],
    req.paramBody["filename"],
    "함수 안========>",
  );

  return mysqlUtil.querySingle(db_connection, "call proc_create_video_review", [
    req.headers["user_uid"],
    req.paramBody["representative_product_uid"],
    req.paramBody["content"],
    req.paramBody["filename"],
  ]);
}

function query_m3u8(req, db_connection) {
  const _funcName = arguments.callee.name;

  return mysqlUtil.querySingle(
    db_connection,
    "call proc_create_video_review_m3u8",
    [
      req.headers["user_uid"],
      req.paramBody["representative_product_uid"],
      req.paramBody["content"],
      req.paramBody["filename"],
    ],
  );
}

function queryInsertFCM(data, db_connection) {
  return mysqlUtil.querySingle(db_connection, "call proc_create_fcm_data", [
    data["user_uid"],
    data["alarm_type"],
    data["title"],
    data["message"],
    data["video_uid"] == null ? 0 : data["video_uid"],
    data["target_uid"] == null ? 0 : data["target_uid"],
    data["icon_filename"],
  ]);
}

function queryAlertComment(req, db_connection) {
  return mysqlUtil.querySingle(db_connection, "call proc_select_alert_list", [
    req.innerBody["item"]["seller_uid"],
  ]);
}

async function queryProductBulkInsert(req, db_connection) {
  console.log("일단 벌크 들어옴");
  console.log(req.paramBody["product_uid"]);
  if (req.paramBody["product_uid"].length > 6) {
    const err = new Error("동영상 리뷰에 6개의 상품까지 등록할 수 있습니다.");
    throw err;
  }
  const productData = req.paramBody["product_uid"].map((result) => [
    req.innerBody.item["uid"],
    result,
  ]);
  const videoProductInsertSql = `
        insert into tbl_video_product(video_uid, product_uid)
        values ?;
    `;

  await db_connection.query(videoProductInsertSql, [productData]);
}
