/**
 * Created by gunucklee on 2022. 01. 13.
 *
 * @swagger
 * definitions:
 *   proc_Single_GiftOrder:
 *     allOf:
 *       - $ref: '#/definitions/GiftTable'
 *       - type: object
 *         properties:
 *           order_product_uid:
 *             type: number
 *             example: 98
 *             description: 문의한 상품 주문 uid
 *           product_name:
 *             type: string
 *             example: 상품명입니다
 *             description: 상품명
 *           option_names:
 *             type: string
 *             example: "술고래 술잔세트 4p,벚꽃 술잔세트 4p,술고래 2p + 벚꽃 2p"
 *             description: 옵션 목록 이름
 *           product_image:
 *             type: string
 *             example: "cddaad161993eca3b511f4729ea5cc89.png"
 *             description: 상품 이미지명
 *           delivery_msg:
 *             type: string
 *             example: 경비실에 맡겨 주세요.
 *             description: 선물 받는 사람의 배송 메모
 *           product_uid:
 *             type: number
 *             example: 5
 *             description: 상품 uid
 *           nickname:
 *             type: string
 *             example: "깜도니"
 *             description: 유저 닉네임
 *           profile_image:
 *             type: string
 *             example: "52b0d37685420f8ee043b9331b1fca25.png"
 *             description: 프로필 이미지
 *
 *   GiftOrderApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/proc_Single_GiftOrder'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/gift/${path}"
 *         description: api 경로
 */



