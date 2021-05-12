/**
 * Created by hyunhunhwang on 2021. 02. 18.
 *
 * @swagger
 * definitions:
 *   Order:
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
 *       status:
 *         type: number
 *         example: 1
 *         description: |
 *           구매 상태
 *           * 1: 결제 완료
 *           * 2: 상품 준비중
 *           * 3: 배송중
 *           * 4: 배송완료
 *           * 5: 구매확정
 *           * 6: 구매취소
 *         enum: [1,2,3,4,5,6]
 *       delivery_number:
 *         type: string
 *         example: 1234567890
 *         description: 택배사 송장번호
 *       delivery_code:
 *         type: string
 *         example: abcdefg.jpg
 *         description: |
 *           택배사 코드번호
 *           * 스마트택배 api 코드번호 사용
 *           * => http://info.sweettracker.co.kr/apidoc/
 *         enum: [1]
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
 *       price_delivery:
 *         type: number
 *         example: 2500
 *         description: 총 배송비
 *       price_payment:
 *         type: number
 *         example: 30500
 *         description: 결제 금액
 *       pg_receipt_id:
 *         type: string
 *         example: 5fffad430c20b903e88a2d17
 *         description: pg사 결제 id
 *       product_uid:
 *         type: number
 *         example: 1
 *         description: 상품 uid
 *       order_uid:
 *         type: number
 *         example: 1
 *         description: 구매 uid
 *       option_ids:
 *         type: string
 *         example: '101,202,303'
 *         description: 옵션 option_id 목록
 *       option_names:
 *         type: string
 *         example: '101상품 / 202상품 / 303상품'
 *         description: 옵션 상품명 목록
 *       name:
 *         type: string
 *         example: '테스트 상품'
 *         description: 상품명
 *       order_count:
 *         type: number
 *         example: 2
 *         description: 구매 수량
 *       filename:
 *         type: string
 *         example: 'abcdefgh.png'
 *         description: 상품 이미지
 *
 */
