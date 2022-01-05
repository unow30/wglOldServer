/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   OrderTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: 구매 uid
 *       is_deleted:
 *         type: number
 *         example: 0
 *         description: |
 *           삭제 여부
 *           * 0: false
 *           * 1: true (삭제됨)
 *         enum: [0,1]
 *       created_time:
 *         type: string
 *         example: 2021-01-01 00:00:00
 *         description: 최초 생성 날짜
 *       updated_time:
 *         type: string
 *         example: 2021-01-01 00:00:00
 *         description: 마지막 수정한 날짜
 *       user_uid:
 *         type: number
 *         example: 1
 *         description: 구매자 유저 UID
 *       seller_uid:
 *         type: number
 *         example: 2
 *         description: 판매자 유저 UID
 *       addressbook_uid:
 *         type: number
 *         example: 2
 *         description: 배송지 UID
 *       order_no:
 *         type: number
 *         example: 1613605871001
 *         description: 주문번호
 *       delivery_msg:
 *         type: string
 *         example: 집 문앞에 놔주세요.
 *         description: |
 *           배송 메모
 *       seller_msg:
 *         type: string
 *         example: 잘 보내주세요
 *         description: 판매자 메세지
 *       use_point:
 *         type: number
 *         example: 10000
 *         description: 사용 포인트
 *       use_reward:
 *         type: number
 *         example: 12000
 *         description: 사용 리워드
 *       price_total:
 *         type: number
 *         example: 50000
 *         description: 총 상품 금액
 *       delivery_total:
 *         type: number
 *         example: 50000
 *         description: 주문 배송비 총합
 *       price_payment:
 *         type: number
 *         example: 30500
 *         description: 결제 금액
 *       pg_receipt_id:
 *         type: string
 *         example: 5fffad430c20b903e88a2d17
 *         description: pg사 결제 id
 *       cancelable_price:
 *         type: number
 *         example: 28000
 *         description: 교환/환불 가능 금액
 *       cancelable_point:
 *         type: number
 *         example: 10000
 *         description: 교환/환불 가능 포인트
 *       cancelable_reward:
 *         type: number
 *         example: 12000
 *         description: 교환/환불 가능 리워드
 *       seller_unread:
 *         type: number
 *         example: 0
 *         description: |
 *           판매자용 읽음표시
 *           * 0: 읽지 않음
 *           * 1: 읽음
 *         enum: [0,1]
 *       payment_method:
 *         type: number
 *         example: 4
 *         description: |
 *           결제 방식
 *           * 0: 신용카드
 *           * 1: 카카오페이
 *           * 2: 무통장입금
 *           * 3: 가상계좌
 *           * 4: 네이버페이
 *       v_bank_account_number:
 *         type: string
 *         example: "60519014559143"
 *         description: 가상계좌 계좌번호
 *       v_bank_expired_time:
 *         type: string
 *         example: 2021-01-01 00:00:00
 *         description: 가상계좌 입금요청기한
 *       v_bank_bank_name:
 *         type: string
 *         example: "기업은행"
 *         description: 가상계좌 은행명
 *       gift_uid:
 *         type: number
 *         example: 130
 *         description: 선물 uid
 */
