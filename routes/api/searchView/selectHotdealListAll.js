/**
 * Created by yunhokim
 *
 * @swagger
 * /api/public/searchview/hotdeal/list/all:
 *   get:
 *     summary: 모아보기 타임 핫딜 탭 정보 불러오기
 *     tags: [v3SearchView]
 *     description: |
 *      ## path : /api/public/searchview/hotdeal/list/all:
 *
 *       * ## 모아보기 타임 핫딜 탭 정보 불러오기
 *
 *     parameters:
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           페이지 시작 값을 넣어주시면 됩니다. Limit 12
 *           offset 0: 0~11
 *           offset 12: 12~23
 *           offset 24: 24~35
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */
const paramUtil = require("../../../common/utils/legacy/origin/paramUtil");
const fileUtil = require("../../../common/utils/legacy/origin/fileUtil");
const mysqlUtil = require("../../../common/utils/legacy/origin/mysqlUtil");
const sendUtil = require("../../../common/utils/legacy/origin/sendUtil");
const errUtil = require("../../../common/utils/legacy/origin/errUtil");
const logUtil = require("../../../common/utils/legacy/origin/logUtil");

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
        let { offset } = req.paramBody;
        req.innerBody["hotdeal"] = await queryTimeHotdeal(
          offset,
          db_connection,
        );

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

async function queryTimeHotdeal(offset, db_connection) {
  offset = parseInt(offset);
  let query = `select
   p.uid as productUid
 , p.created_time
 , u.uid as userUid
 , p.name as productName
 , image_p.filename as productImage
 , p.price_original as priceOriginal
 , p.price_discount as priceDiscount
 , p.discount_rate as discountRate
 , '2023-12-26 00:00:00' as startTime
 , '2023-12-31 23:59:59' as endTime
 , sum(po.stock) stock
 , sum(po.sales_quantity) as salesQuantity
from tbl_product as p
    inner join tbl_user as u
        on u.uid = p.user_uid
       and u.is_promotion = 1
    inner join tbl_product_option as po
        on po.product_uid = p.uid
       and po.is_deleted = 0
    inner join tbl_image as image_p
        on image_p.uid = (
            select
                uid
            from tbl_image
            where tbl_image.target_uid = p.uid
            and tbl_image.type = 2
            and tbl_image.is_deleted = 0
            limit 1
            )
where CURDATE() >= '2023-12-26 00:00:00' and CURDATE() <= '2023-12-31 23:59:59'
group by p.uid
limit 12 offset ?;`;

  return new Promise(async (resolve, reject) => {
    db_connection.query(query, [offset], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
