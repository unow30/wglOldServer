/**
 * Created by gunucklee on 2022. 02. 14.
 *
 * @swagger
 * /api/private/dev/searchview/new/product/list:
 *   get:
 *     summary: 검색 화면 - New Product(신규 상품) 목록
 *     tags: [Dev]
 *     description: |
 *       path : /dev/searchview/new/product/list
 *
 *       * 검색 화면 - New Product(신규 상품) 목록
 *
 *     parameters:
 *        - in: query
 *          name: offset
 *          default: 0
 *          required: false
 *          schema:
 *            type: number
 *            example: 0
 *          description: |
 *            목록 마지막 페이지 (처음일 경우 0)
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
const naverUtil = require('../../../common/utils/naverUtil');

let file_name = fileUtil.name(__filename);

module.exports = async function (req, res) {
    const _funcName = arguments.callee.name;

    try {
        req.file_name = file_name;
        logUtil.printUrlLog(req, `== function start ==================================`);
        req.paramBody = paramUtil.parse(req);

        const naverAPI = new naverUtil(req.paramBody.product_name);
        const naverProduct = await naverAPI.result();
        req.paramBody['naver_product'] = naverProduct.items[0];
        req.paramBody['options'] = optionJson();
        req.paramBody['room_type'] = typeJson();

        mysqlUtil.connectPool(async function (db_connection) {
            req.innerBody = {};

            req.innerBody['item'] = await queryCreate(req, db_connection);

            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        });

    } catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

function queryCreate(req, db_connection) {
    const _funcName = arguments.callee.name;

    return mysqlUtil.querySingle(db_connection
        , 'call proc_create_groupbuying'
        , [
            req.paramBody['product_uid'],
            req.paramBody['gongu_price'],
            req.paramBody['gongu_rate'],
            req.paramBody['room_type'],
            req.paramBody.naver_product['link'],
            req.paramBody.naver_product['lprice'],
            req.paramBody['end_time'],
            req.paramBody['start_time'],
            req.paramBody['options'],
        ]
    );
}

async function optionJson (req) {
    return  JSON.stringify([
            { sales_quantity: 0,
                stock: 30,
                name: '빨간색 티',
            },
            { sales_quantity: 0,
                stock: 50,
                name: '검정색 티',
            },
            { sales_quantity: 0,
                stock: 100,
                name: '하얀색 티',
            },
            { sales_quantity: 0,
                stock: 150,
                name: '청록색 티',
            }
        ]
    )

}

function typeJson(req, db_connection) {
    return  JSON.stringify([
        {   type: 2,
            price: 300,
            required: true,
        },
        {   type: 5,
            price: 500,
            required: false,
        },
        {   type: 10,
            price: 700,
            required: true,
        },

        ]
    )
}