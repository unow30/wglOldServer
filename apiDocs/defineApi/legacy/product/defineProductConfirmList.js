/**
 * Created by gunucklee on 2022. 01. 06.
 *
 * @swagger
 * definitions:
 *   Proc_Array_ProductConfirmList:
 *     allOf:
 *       - $ref: '#/definitions/OrderProductTable'
 *       - type: object
 *         properties:
 *           _product_uid:
 *             type: number
 *             example: 5
 *             description: 상품 uid
 *           is_deal:
 *             type: number
 *             example: 0
 *             description: |
 *               위글 딜 진행 여부
 *               * 0: 위글딜 아님
 *               * 1: 위글딜 진행 중
 *               * 2: 위글딜 심사 중
 *             enum: [0,1,2]
 *           deal_price_discount:
 *             type: number
 *             example: 10
 *             description: 위글 딜 할인가
 *           price_discount:
 *             type: number
 *             example: 10000
 *             description: 할인 가격
 *           nickname:
 *             type: string
 *             example: nickch
 *             description: 닉네임
 *           profile_image:
 *             type: string
 *             example: "52b0d37685420f8ee043b9331b1fca25.png"
 *             description: 프로필 이미지
 *
 *   ProductConfirmListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_ProductConfirmList'
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



