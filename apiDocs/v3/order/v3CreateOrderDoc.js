/**
 * Created by hyunhunhwang on 2021. 02. 10.
 *
 * @swagger
 * /api/private/v3/order:
 *   post:
 *     summary: v3 상품 구매
 *     tags: [Order]
 *     description: |
 *       ## path : /api/private/v3/order
 *       ## file : v3CreateOrderDoc.js
 *
 *       * ## 상품 구매 v3
 *       * ## 서버에서 결제내역 검증 후 승인
 *       * ## pg_receipt_id가 공백값이면 포인트,리워드결제이다.
 *       * ## 이벤트 결제에 대한 분기처리 필요
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           상품 구매
 *
 *           payment_method
 *           * 0: 신용카드
 *           * 1: 카카오페이
 *           * 2: 무통장입금
 *           * 3: 가상계좌
 *           * 4: 네이버페이
 *           * 5: 포인트,리워드결제
 *           * 6: 이벤트 결제
 *         schema:
 *           type: object
 *           required:
 *             - addressbook_uid
 *             - pg_receipt_id
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
 *             pg_receipt_id:
 *               type: string
 *               example: 611b3e5e7b53hn2a40025b0cc99
 *               description: |
 *                 PG사 결제 완료 값 id
 *             product_list:
 *               type: array
 *               description: 구매 상품 목록
 *               items:
 *                 type: object
 *                 properties:
 *                   product_uid:
 *                     type: number
 *                     example: 100053
 *                     description: 구매 상품 uid
 *                   seller_uid:
 *                     type: number
 *                     example: 224
 *                     description: |
 *                       판매자 uid
 *                   video_uid:
 *                     type: number
 *                     example: 1
 *                     description: |
 *                       리뷰어 영상 uid
 *                       * 리뷰어가 없을 경우 0으로 보내면 됩니다.
 *                   option_ids:
 *                     type: string
 *                     example: '101'
 *                     description: |
 *                       옵션 option_id 목록
 *                       * ','로 구분
 *                   count:
 *                     type: number
 *                     example: 2
 *                     description: |
 *                       구매 갯수
 *                       * 최소 1개 이상
 *                   price_original:
 *                     type: number
 *                     example: 25000
 *                     description: 상품 1개당 판매가(tbl_order_product의 price_original)
 *                   payment:
 *                     type: number
 *                     example: 50000
 *                     description: |
 *                       해당 상품 구매 금액
 *                       * price_discount * count
 *                   price_delivery:
 *                     type: number
 *                     example: 2000
 *                     description: |
 *                       판매자 배송비
 *
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */