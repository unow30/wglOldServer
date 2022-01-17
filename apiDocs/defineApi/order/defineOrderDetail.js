/**
 * Created by gunucklee on 2022. 01. 17.
 *
 * @swagger
 * definitions:
 *   Proc_Array_OrderDetail:
 *     allOf:
 *       - $ref: '#/definitions/OrderTable'
 *       - type: object
 *         properties:
 *           phone:
 *             type: string
 *             example: "000-0000-0000"
 *             description: 판매자 연락처
 *           addressbook_uid:
 *             type: number
 *             example: 2
 *             description: 배송지 UID
 *           receive_name:
 *             type: string
 *             example: "길동이"
 *             description: 받는사람명
 *           zipcode:
 *             type: string
 *             example: "00000"
 *             description: 우편번호
 *           address:
 *             type: string
 *             example: "서울 강남 어디어디"
 *             description: 주소
 *           address_detail:
 *             type: string
 *             example: "a 아파트 00동 00호"
 *             description: 상세 주소
 *           recipient_name:
 *             type: string
 *             example: "도마스터"
 *             description: 선물 받는 사람의 이름
 *           msg_card:
 *             type: string
 *             example: "도마스터 제가 선물로 애플 마우스 드릴게영. 너무 가지고 싶어하는 당신의 모습을 보니까 제가 기분이 너무 좋아용~"
 *             description: 보내는 사람의 메시지 카드
 *           gift_status:
 *             type: number
 *             example: 0
 *             description: 선물 상태
 *
 *   Proc_Array_OrderSellerList:
 *     allOf:
 *       - $ref: '#/definitions/UserTable'
 *       - type: object
 *         properties:
 *           seller_image:
 *             type: string
 *             example: "52b0d37685420f8ee043b9331b1fca25.png"
 *             description: 판매자 프로필 이미지
 *           order_seller_product_list:
 *             type: array
 *             items:
 *               properties:
 *                 uid:
 *                   type: number
 *                   example: 3
 *                   description: order product uid
 *                 video_uid:
 *                   type: number
 *                   example: 5
 *                   description: 영상 uid
 *                 count:
 *                   type: number
 *                   example: 2
 *                   description: |
 *                     구매 갯수
 *                     * 최소 1개 이상
 *                 payment:
 *                   type: number
 *                   example: 24000
 *                   description: |
 *                     해당 상품 구매 금액
 *                     * price_original * count
 *                 product_name:
 *                   type: string
 *                   example: "왕밤빵왕만두"
 *                   description: 상품명
 *                 product_uid:
 *                   type: number
 *                   example: 5
 *                   description: 상품 uid
 *                 price_delivery:
 *                   type: number
 *                   example: 0
 *                   description: |
 *                     판매자 배송비
 *                 delivery_status:
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
 *                 delivery_number:
 *                   type: string
 *                   example: "01234567890"
 *                   description: 택배사 송장번호
 *                 delivery_code:
 *                   type: string
 *                   example: "08"
 *                   description: |
 *                     택배사 코드번호
 *                     * 스마트택배 api 코드번호 사용
 *                     * => http://info.sweettracker.co.kr/apidoc/
 *                 option_names:
 *                   type: string
 *                   example: "술고래 술잔세트 4p,벚꽃 술잔세트 4p,술고래 2p + 벚꽃 2p"
 *                   description: 옵션 목록 이름
 *                 product_image:
 *                   type: string
 *                   example: "cddaad161993eca3b511f4729ea5cc89.png"
 *                   description: 상품 이미지명
 *                 nickname:
 *                   type: string
 *                   example: "이건욱"
 *                   description: 닉네임
 *                 profile_image:
 *                   type: string
 *                   example: "52b0d37685420f8ee043b9331b1fca25.png"
 *                   description: 프로필 이미지
 *
 *
 *   OrderDetailApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_OrderDetail'
 *       seller_list:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_OrderSellerList'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/product/${path}"
 *         description: api 경로
 */



