/**
 * Created by gunucklee on 2022. 01. 05.
 *
 * @swagger
 * definitions:
 *   RewardTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: reward uid
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
 *       product_uid:
 *         type: number
 *         example: 3
 *         description: 리워드 상품 uid - 영상 테이블에 존재함
 *       user_uid:
 *         type: number
 *         example: 12
 *         description: 리워드 받는 유저 uid - 영상 테이블에 존재함
 *       seller_uid:
 *         type: number
 *         example: 142
 *         description: 리워드를 받은 판매자 uid
 *       video_uid:
 *         type: number
 *         example: 342
 *         description: 리워드를 받은 영상 uid
 *       order_uid:
 *         type: number
 *         example: 342
 *         description: 주문 uid
 *       order_no:
 *         type: number
 *         example: 2147483647
 *         description: 리워드 받은 주문 no
 *       state:
 *         type: number
 *         example: 12
 *         description: |
 *           리워드 상태
 *           * 1: 리워드 적립
 *           * 2: 리워드 상품 구매에 사용
 *           * 11: 리워드 환급 신청
 *           * 12: 리워드 환급 완료
 *           * 13: 리워드 환불
 *       amount:
 *         type: number
 *         example: -2000
 *         description: |
 *           적립, 사용, 환급신청 금액
 *           * 적립, 환급 신청: 100
 *           * 사용, 적립취소, 환급 완료: -300
 *       content:
 *         type: string
 *         example: "환급 완료"
 *         description: 지급 내용
 *       account_book_uid:
 *         type: number
 *         example: 131
 *         description: 계좌 uid
 */
