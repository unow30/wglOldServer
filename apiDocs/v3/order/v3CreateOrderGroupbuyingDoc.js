/**
 * Created by yunhokim on 2023. 03. 31.
 *
 * @swagger
 * /api/private/v3/order/groupbuying:
 *   post:
 *     summary: v3 공구 상품 구매
 *     tags: [Order]
 *     description: |
 *      ## path : /api/private/v3/order/groupbuying
 *      ## file : v3CreateGroupbuyingOrderDoc.js
 *
 *       * ## v3 공동구매 상품 구매
 *       * ## 포인트 사용 x
 *       * ## 배송비 0원
 *       * ## 무통장입금, 가상계좌 결제 불가
 *       * ## video_uid = 0 -> 공구상품 리뷰 업로드 불가(일반상품 가능)
 *       * ## 서버에서 결제 검증 후 승인
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           공동구매 상품 구매
 *
 *           payment_method
 *           * 0: 신용카드
 *           * 1: 카카오페이
 *           * 4: 네이버페이
 *
 *           groupbuying_room_uid
 *           * 공구방 '생성'시에는 0으로 한다.
 *           * 공구방 '참가'시에는 참가할 공구방 uid 입력
 *
 *           recruitment
 *           * 공구방 '생성'시 참여가능한 인원수를 입력한다(2,5,10)
 *           * 공구방 '참가'시 참여가능 인원수를 받지 않아도 된다(0으로 줘도 됨)
 *
 *           use_point
 *           * 포인트는 사용 못하니 0으로 전달
 *
 *           quantity
 *           * 구매 수량(최대 10개)
 *           * product_list의 count와 같다.
 *         schema:
 *           type: object
 *           required:
 *             - addressbook_uid
 *             - price_total
 *             - delivery_total
 *             - price_payment
 *             - payment_method
 *           properties:
 *             addressbook_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 배송지 주소 uid
 *             delivery_msg:
 *               type: string
 *               example: 집 문앞에 놔주세요
 *               description: |
 *                 배송메모
 *             seller_msg:
 *               type: string
 *               example: 잘 보내주세요
 *               description: |
 *                 판매자에게 메세지
 *             use_point:
 *               type: number
 *               example: 0
 *               description: |
 *                 포인트 사용 금액
 *                 * 사용 안할 경우 0
 *             use_reward:
 *               type: number
 *               example: 0
 *               description: |
 *                 리워드 사용 금액
 *                 * 사용 안할 경우 0
 *             price_total:
 *               type: number
 *               example: 50000
 *               description: |
 *                 총 상품 금액
 *             delivery_total:
 *               type: number
 *               example: 0
 *               description: |
 *                 주문 배송비 총합
 *                 * 배송비가 없을 경우 0
 *             price_payment:
 *               type: number
 *               example: 50000
 *               description: |
 *                 결제 금액
 *             pg_receipt_id:
 *               type: string
 *               example: 5fffad430c20b903e88a2d17
 *               description: |
 *                 PG사 결제 완료 값 id
 *             payment_method:
 *               type: number
 *               example: 1
 *               description: |
 *                 결제 방법
 *                 * 0: 신용카드
 *                 * 1: 카카오페이
 *                 * 4: 네이버페이
 *             groupbuying_uid:
 *               type: number
 *               example: 15
 *               description: |
 *                 공구 uid
 *             groupbuying_room_uid:
 *               type: number
 *               example: 8
 *               description: |
 *                 공구 방 uid(방을 생성할 경우 0으로 전달)
 *             recruitment:
 *               type: number
 *               example: 2
 *               description: |
 *                 모집인원(2,5,10)
 *             groupbuying_option_uid:
 *               type: number
 *               example: 1
 *               description: |
 *                 공구 옵션 uid
 *             quantity:
 *               type: number
 *               example: 1
 *               description: |
 *                 공구 구매 수량(최대 10개)
 *             product_list:
 *               type: array
 *               description: 구매 상품 목록
 *               items:
 *                 type: object
 *                 properties:
 *                   product_uid:
 *                     type: number
 *                     example: 3
 *                     description: 구매 상품 uid
 *                   seller_uid:
 *                     type: number
 *                     example: 2
 *                     description: |
 *                       판매자 uid
 *                   video_uid:
 *                     type: number
 *                     example: 0
 *                     description: |
 *                       리뷰어 영상 uid
 *                       * 리뷰어가 없을 경우 0으로 보내면 됩니다.
 *                   count:
 *                     type: number
 *                     example: 1
 *                     description: |
 *                       구매 갯수
 *                       * 최소 1개 이상
 *                   price_original:
 *                     type: number
 *                     example: 50000
 *                     description: 상품 1개당 원가
 *                   payment:
 *                     type: number
 *                     example: 50000
 *                     description: |
 *                       해당 상품 구매 금액
 *                       * price_original * count
 *                   price_delivery:
 *                     type: number
 *                     example: 0
 *                     description: |
 *                       판매자 배송비
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */