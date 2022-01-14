/**
 * Created by gunucklee on 2022. 01. 13.
 *
 * @swagger
 * definitions:
 *   proc_Single_GiftRefund:
 *     allOf:
 *       - $ref: '#/definitions/OrderProductTable'
 *       - type: object
 *         properties:
 *           order_no:
 *             type: number
 *             example: 1637288387001
 *             description: 주문 no
 *           name:
 *             type: string
 *             example: "상풍명입니다."
 *             description: 상품명
 *           reward_user_uid:
 *             type: number
 *             example: 1
 *             description: 리워드 유저 uid
 *           type:
 *             type: number
 *             example: 2
 *             description: |
 *               영상 타입
 *               * 1: 판매자가 올린 영상
 *               * 2: 리뷰어가 올린 영상
 *             enum: [1,2]
 *           filename:
 *             type: string
 *             example: "abcdefg.jpg"
 *             description: 상품 파일명
 *
 *
 *   GiftRefundApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/proc_Single_GiftRefund'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/gift/${path}"
 *         description: api 경로
 */



