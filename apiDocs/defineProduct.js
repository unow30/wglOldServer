/**
 * Created by hyunhunhwang on 2021. 01. 12.
 *
 * @swagger
 * definitions:
 *   Product:
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
 *         example: 2021-01-07T08:56:28.000Z
 *         description: 최초 생성 날짜
 *       updated_time:
 *         type: string
 *         example: 2021-01-07T08:56:28.000Z
 *         description: 마지막 수정한 날짜
 *       user_uid:
 *         type: number
 *         example: 1
 *         description: 판매자 유저 UID
 *       name:
 *         type: string
 *         example: 상풍명입니다.
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
 *         example: 2021-01-07 08:56:28
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
 *         example: 2500
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
 *         type: string
 *         example: 택배회사
 *         description: 배송 방법
 *       delivery_time:
 *         type: string
 *         example: 3일 이내
 *         description: 배송 시간
 *       category:
 *         type: number
 *         example: 4
 *         description: |
 *           상품 카테고리
 *           * 1: 식품
 *           * 2: 뷰티
 *           * 4: 홈데코
 *           * 8: 패션잡화
 *           * 16: 반려동물
 *           * 32: 유아
 *           * 64: 스포츠레저
 *           * 128: 식물
 *         enum: [1,2,4,8,16,32,64,128]
 *       nickname:
 *         type: string
 *         example: 판매자명
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
 *         example: 주소어디어디
 *         description: 판매자 주소
 *       latitude:
 *         type: number
 *         example: 37.5000366
 *         description: 판매자 위치 - 위도
 *       longitude:
 *         type: number
 *         example: 127.1039913
 *         description: 판매자 위치 - 경도
 *       user_filename:
 *         type: string
 *         example: cddaad161993eca3b511f4729ea5cc89.png
 *         description: 판매자 프로필이미지명
 *       detail_filename:
 *         type: string
 *         example: cddaad161993eca3b511f4729ea5cc89.png
 *         description: 상세 이미지명
 *       distance:
 *         type: number
 *         example: 14
 *         description: 나와의 거리(단위-km)
 *       is_follow:
 *         type: number
 *         example: 0
 *         description: |
 *           내가 팔로우했는지 여부
 *           * 0: 안함
 *           * 1: 팔로우함
 *         enum: [0,1]
 *       is_liked:
 *         type: number
 *         example: 0
 *         description: |
 *           내가 좋아요했는지 여부
 *           * 0: 안함
 *           * 1: 좋아요함
 *         enum: [0,1]
 *       image_count:
 *         type: number
 *         example: 0
 *         description: 상품 이미지 갯수
 *       review_count:
 *         type: number
 *         example: 0
 *         description: 리뷰 갯수
 *
 */

