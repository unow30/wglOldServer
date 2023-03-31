/**
 * Created by gunucklee on 2021. 11. 16.
 *
 * @swagger
 * /api/private/v3/order/gift:
 *   post:
 *     summary: v3 선물 상품 구매
 *     tags: [Order]
 *     description: |
 *       ## path : /api/private/v3/order/gift
 *       ## file ; v3CreateGiftOrderDoc.js
 *
 *       * ## v3 선물 상품 구매
 *       * ## pg_receipt_id가 공백값이면 포인트,리워드결제이다.
 *
 *     parameters:
 *       - in: body
 *         name: body
 *         description: |
 *           선물 상품 구매
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
 *             - pg_receipt_id
 *             - recipient_name
 *             - msg_card
 *           properties:
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
 *               example: 5fffad430c20b1903e88a2d17
 *               description: |
 *                 PG사 결제 완료 값 id
 *             recipient_name:
 *               type: string
 *               example: 선물 받는 사람의 이름
 *               description: |
 *                 도마스터
 *             msg_card:
 *               type: string
 *               example: 보내는 사람의 메시지 카드
 *               description: |
 *                 도마스터 제가 선물로 애플 마우스 드릴게영. 너무 가지고 싶어하는 당신의 모습을 보니까 제가 기분이 너무 좋아용~
 *             product_list:
 *               type: array
 *               description: 구매 상품 목록
 *               items:
 *                 type: object
 *                 properties:
 *                   product_uid:
 *                     type: number
 *                     example: 1
 *                     description: 구매 상품 uid
 *                   seller_uid:
 *                     type: number
 *                     example: 1
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
 *                     example: '101,202,303'
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
 *                     example: 12000
 *                     description: 상품 1개당 원가
 *                   payment:
 *                     type: number
 *                     example: 24000
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
 *         schema:
 *           $ref: '#/definitions/SearchViewUserSearchListApi'
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */