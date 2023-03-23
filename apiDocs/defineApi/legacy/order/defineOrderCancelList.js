/**
 * Created by gunucklee on 2022. 01. 06.
 *
 * @swagger
 * definitions:
 *   Proc_Array_OrderCancelList:
 *     allOf:
 *       - $ref: '#/definitions/OrderTable'
 *       - type: object
 *         properties:
 *           order_product_cancel_list:
 *             type: array
 *             items:
 *               properties:
 *                 uid:
 *                   type: number
 *                   example: 3
 *                   description: order product uid
 *                 created_time:
 *                   type: string
 *                   example: 2021-01-01 00:00:00
 *                   description: 최초 생성 날짜
 *                 product_image:
 *                   type: string
 *                   example: "cddaad161993eca3b511f4729ea5cc89.png"
 *                   description: 상품 이미지명
 *                 price_payment:
 *                   type: number
 *                   example: 52500
 *                   description: 결제 금액
 *                 product_uid:
 *                   type: number
 *                   example: 5
 *                   description: 상품 uid
 *                 order_status:
 *                   type: number
 *                   example: 1
 *                   description: |
 *                     구매 상태
 *                     * 1: 결제 완료
 *                     * 2: 상품 준비중
 *                     * 3: 배송중
 *                     * 4: 배송완료
 *                     * 5: 구매확정
 *                     * 6: 구매취소
 *                     * 10: 반품 신청
 *                     * 11: 반품 거절
 *                     * 12: 반품 완료
 *                     * 20: 교환 신청
 *                     * 21: 교환 거절
 *                     * 22: 교환 완료
 *                   enum: [1,2,3,4,5,6,10,11,12,20,21,22]
 *                 order_no:
 *                   type: number
 *                   example: 1
 *                   description: |
 *                     주문번호
 *                     * 고유하게 위글에서 자동 발행
 *                     * unix시간(초까지) * 1000 + unix시간 주문 갯수
 *                     * ex) 1612940926 * 1000 + 2 = 1612940926002
 *                 product_option_name:
 *                   type: string
 *                   example: "술고래 술잔세트 4p,벚꽃 술잔세트 4p,술고래 2p + 벚꽃 2p"
 *                   description: 옵션 목록 이름
 *                 product_name:
 *                   type: string
 *                   example: "왕밤빵왕만두"
 *                   description: 상품명
 *                 seller_nickname:
 *                   type: string
 *                   example: "이건욱"
 *                   description: 판매자 닉네임
 *                 seller_phone:
 *                   type: string
 *                   example: 000-0000-0000
 *                   description: 판매자 연락처
 *                 seller_image:
 *                   type: string
 *                   example: "52b0d37685420f8ee043b9331b1fca25.png"
 *                   description: 판매자 프로필 이미지
 *
 *
 *
 *
 *
 *   ProductOrderCancelListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_OrderCancelList'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/product/${path}"
 *         description: api 경로
 */



