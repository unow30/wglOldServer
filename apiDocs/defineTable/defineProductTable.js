/**
 * Created by gunucklee on 2022. 01. 03.
 *
 * @swagger
 * definitions:
 *   ProductTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 5
 *         description: 상품 uid
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
 *         example: 2021-01-07 08:52:23
 *         description: 최초 생성 날짜
 *       updated_time:
 *         type: string
 *         example: 2021-01-07 08:52:23
 *         description: 마지막 수정한 날짜
 *       user_uid:
 *         type: number
 *         example: 3
 *         description: 판매자 유저 uid
 *       name:
 *         type: string
 *         example: "가나다라 상품"
 *         description: 상품명
 *       sale_type:
 *         type: string
 *         example: "onsale"
 *         description: |
 *           영상 타입
 *           * onsale: 판매 중
 *           * soldout: 판매 완료 (품절)
 *       price_original:
 *         type: number
 *         example: 3000
 *         description: 상품 원가
 *       price_discount:
 *         type: number
 *         example: 2700
 *         description: 할인가
 *       discount_rate:
 *         type: number
 *         example: 5
 *         description: 할인율(%)
 *       deal_endtime:
 *         type: string
 *         example: 2021-05-04
 *         description: 위글 딜 종료 날짜
 *       is_deal:
 *         type: number
 *         example: 0
 *         description: |
 *           위글 딜 진행 여부
 *           * 0: 위글딜 아님
 *           * 1: 위글딜 진행 중
 *           * 2: 위글딜 심사 중
 *         enum: [0,1,2]
 *       is_recommend:
 *         type: number
 *         example: 0
 *         description: |
 *           추천 동영상 여부
 *           * 0: false
 *           * 1: true (추천 동영상)
 *         enum: [0,1]
 *       category:
 *         type: number
 *         example: 5
 *         description: |
 *           카테고리
 *           유저 관심사와 동일 (비트연산)
 *           * 1: 식품
 *           * 2: 뷰티, 주얼리
 *           * 4: 인테리어
 *           * 8: 패션, 잡화
 *       count_like:
 *         type: number
 *         example: 3
 *         description: 좋아요 갯수
 *       count_total:
 *         type: number
 *         example: 12
 *         description: 총 상품 갯수
 *       count_sale:
 *         type: number
 *         example: 150
 *         description: 판매된 상품 갯수
 *       detail_info:
 *         type: string
 *         example: "상품에 대한 상세 설명란 입니다."
 *         description: 상품 상세 설명
 *       deal_starttime:
 *         type: string
 *         example: 2021-01-07 08:52:23
 *         description: 위글 딜 시작날짜
 *       deal_discount_rate:
 *         type: number
 *         example: 10
 *         description: 위글 딜 할인율(%)
 *       deal_price_discount:
 *         type: number
 *         example: 10
 *         description: 위글 딜 할인가
 *       cancel_info:
 *         type: string
 *         example: "교환 및 반품 시 먼저 판매자와 연락하셔서 교환 및 반품사유, 택배사, 배송비, 반품지 주소 등을 협의하신 후 상품을 발송해 주시기 바랍니다."
 *         description: 반품 및 교환정보
 *       requested_price_original:
 *         type: number
 *         example: 4500
 *         description: 변경요청 상품 원가
 */