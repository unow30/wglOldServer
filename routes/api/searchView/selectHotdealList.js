/**
 * Created by yunhokim
 *
 * @swagger
 * /api/public/searchview/hotdeal/list/:
 *   get:
 *     summary: 모아보기 타임 핫딜 정보 더보기
 *     tags: [v3SearchView]
 *     description: |
 *      ## path : /api/public/searchview/hotdeal/list/:
 *
 *       * ## 모아보기 타임 핫딜 정보 더보기
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
        offset = parseInt(offset);
        req.innerBody["time_hotdeal"] = await queryHotdeal(
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

function queryHotdeal(offset, db_connection) {
  return new Promise((resolve, reject) => {
    const query = `select
    p.uid as product_uid
  , p.sale_type   
  , pt.uid as timedeal_uid
  , pt.start_time
  , pt.end_time
  , pt.type as timedeal_type
  , p.name as name
  , (select _image.filename
                   from tbl_image as _image
                   where _image.is_deleted = 0
                     and _image.type = 2
                     and _image.target_uid = p.uid
                   order by _image.uid asc
                   limit 1) as product_image
  , p.price_original as product_price_original
  , p.price_discount as product_price_discount
  , p.discount_rate as product_discount_rate
from tbl_product as p
inner join tbl_product_timedeal as pt
    on pt.product_uid = p.uid
   and pt.is_deleted = 0
inner join tbl_user as u
    on u.uid = p.user_uid
   and u.is_deleted = 0
   and u.is_seller = 1
where date_format(pt.start_time, '%Y-%m-%d') <= curdate()
  and date_format(pt.end_time, '%Y-%m-%d') >= curdate()
  and p.sale_type = 'onsale'
  and p.is_authorize = 1
  and p.is_deleted = 0  
  order by pt.type, pt.round desc
limit 12 offset ?;`;

    db_connection.query(query, [offset], async (err, rows, fields) => {
      if (err) {
        reject(new Error(err));
      } else {
        resolve(rows);
      }
    });
  });
}
