/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   GiftTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: Gift uid
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
 *       order_uid:
 *         type: number
 *         example: 224
 *         description: 주문 테이블 uid
 *       source_uid:
 *         type: number
 *         example: 3
 *         description: 선물한 유저 uid
 *       target_uid:
 *         type: number
 *         example: 14
 *         description: 선물받은 유저 uid
 *       order_no:
 *         type: number
 *         example: 1637288387001
 *         description: 주문 no
 *       status:
 *         type: number
 *         example: 1637288387001
 *         description: |
 *           선물 상태
 *           * 0: 결제 완료 (배송지 미입력) @배송지 입력기한 일주일
 *           * 1: 배송요청
 *           * 10: 선물해준 사람이 취소
 *           * 11: 선물받은 사람이 취소
 *           * 20: 자동환불 (일주일 시간이 지났을 때)
 *       recipient_name:
 *         type: string
 *         example: "이건욱"
 *         description: 선물 받는 사람의 이름
 *       msg_card:
 *         type: string
 *         example: "벌크업해라 ㅋ"
 *         description: 보내는 사람의 메시지 카드
 *       phone:
 *         type: string
 *         example: "01042474682"
 *         description: 선물 받는 사람의 연락처
 *       zipcode:
 *         type: string
 *         example: "7831"
 *         description: 선물 받는 사람의 우편번호
 *       address:
 *         type: string
 *         example: "서울시 강남구 어디어디"
 *         description: 선물 받는 사람의 배송지 주소
 *       address_detail:
 *         type: string
 *         example: "A아파트 00동 00호"
 *         description: 선물 받는 사람의 배송지 주소 상세
 *       expiration_date:
 *         type: string
 *         example: 2021-01-08 00:00:00
 *         description: 선물 유효기간 생성된 일자로부터 일주일 후
 *       acceptance_time:
 *         type: string
 *         example: 2021-01-05 08:00:00
 *         description: 선물 수락 날짜
 */
