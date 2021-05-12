/**
 * Created by hyunhunhwang on 2021. 01. 11.
 *
 * @swagger
 * definitions:
 *   ProductFeed:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
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
 *         example: 2021-01-01 00:00:00
 *         description: 최초 생성 날짜
 *       updated_time:
 *         type: string
 *         example: 2021-01-01 00:00:00
 *         description: 마지막 수정한 날짜
 *       user_uid:
 *         type: number
 *         example: 1
 *         description: 판매자 유저 UID
 *       name:
 *         type: string
 *         example: 상품명
 *         description: 상품명
 *       sale_type:
 *         type: string
 *         example: onsale
 *         description: |
 *           판매 타입
 *           * onsale: 판매중
 *           * soldout: 판매 완료(품절)
 *         enum: [onsale, soldout]
 *       price_original:
 *         type: number
 *         example: 20000
 *         description: 원래 가격
 *       price_discount:
 *         type: number
 *         example: 10000
 *         description: 할인 가격
 *       discount_rate:
 *         type: number
 *         example: 50
 *         description: 할인율
 *       deal_endtime:
 *         type: string
 *         example: 2021-01-01 00:00:00
 *         description: 딜 종료 날짜 시간
 *       is_deal:
 *         type: number
 *         example: 0
 *         description: |
 *           위글 딜 진행 여부
 *           * 0: 위글딜 아님
 *           * 1: 위글딜 진행중
 *         enum: [0, 1]
 *       delivery_price:
 *         type: number
 *         example: 3000
 *         description: 배송비
 *       delivery_free:
 *         type: number
 *         example: 30000
 *         description: 배송비 무료 총 상품 가격
 *       delivery_price_plus:
 *         type: number
 *         example: 2500
 *         description: 제주, 도서 지역 추가 비용
 *       delivery_method:
 *         type: number
 *         example: 한진택배
 *         description: 배송 방법
 *       delivery_time:
 *         type: number
 *         example: 3일이상
 *         description: 배송 시간
 *       category:
 *         type: number
 *         example: 8
 *         description: |
 *           상품 카테고리
 *           * 1: 수제 먹거리
 *           * 2: 음료
 *           * 4: 인테리어 소품
 *           * 8: 악세사리
 *           * 16: 휴대폰 주변기기
 *           * 32: 비누/캔들
 *           * 64: 가죽 공예
 *           * 128: 꽃
 *           * 256: 반려견
 *         enum: [1,2,4,8,16,32,64,128,256]
 *       nickname:
 *         type: string
 *         example: 상점명
 *         description: 판매자 닉네임
 *       is_seller:
 *         type: number
 *         example: 1
 *         description: |
 *           판매자 여부
 *           * 0: 판매자 아님
 *           * 1: 판매자임
 *         enum: [0, 1]
 *       address:
 *         type: string
 *         example: 서울 어디어디
 *         description: 판매자 주소
 *       latitude:
 *         type: number
 *         example: 37.5000366
 *         description: 판매자 위치 - 위도
 *       longitude:
 *         type: number
 *         example: 127.1039913
 *         description: 판매자 위치 - 경도
 *       product_filename:
 *         type: string
 *         example: "cddaad161993eca3b511f4729ea5cc89.png"
 *         description: 상품 이미지명
 */

