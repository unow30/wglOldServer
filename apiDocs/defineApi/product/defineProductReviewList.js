/**
 * Created by gunucklee on 2022. 01. 07.
 *
 * @swagger
 * definitions:
 *   Proc_Array_ProductReviewList:
 *     allOf:
 *       - $ref: '#/definitions/ProductTable'
 *       - type: object
 *         properties:
 *           video_uid:
 *             type: number
 *             example: 5
 *             description: 영상 uid
 *           price_reward:
 *             type: number
 *             example: 800
 *             description: 리워드 금액
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
 *
 *   ProductReviewListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_ProductReviewList'
 *       total_count:
 *         type: number
 *         example: 1
 *         description: 리스트 개수
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/product/${path}"
 *         description: api 경로
 */



