/**
 * Created by gunucklee on 2022. 01. 03.
 *
 * @swagger
 * definitions:
 *   Proc_Array_ProductFeedList:
 *     allOf:
 *       - $ref: '#/definitions/OrderProductTable'
 *       - type: object
 *         properties:
 *           product_discount_price:
 *             type: number
 *             example: 4000
 *             description: 상품 할인 가격
 *           nickname:
 *             type: string
 *             example: "이건욱"
 *             description: 판매자 이름
 *           is_seller:
 *             type: number
 *             example: 0
 *             description: |
 *               판매자 여부
 *               * 0: false
 *               * 1: true (판매자)
 *             enum: [0,1]
 *           address:
 *             type: string
 *             example: 어디어디
 *             description: 판매자 주소
 *           latitude:
 *             type: number
 *             example: 37.5000366
 *             description: 위도
 *           longitude:
 *             type: number
 *             example: 127.1039913
 *             description: 경도
 *           product_filename:
 *             type: string
 *             example: "52b0d37685420f8ee043b9331b1fca25.png"
 *             description: 상품 이미지
 *           is_liked:
 *             type: number
 *             example: 0
 *             description: |
 *               좋아요 여부
 *               * 0: 비활성화
 *               * 1: 활성화
 *             enum: [0,1]
 *
 *   ProductFeedListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_ProductFeedList'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/product/${path}"
 *         description: api 경로
 */