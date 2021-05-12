/**
 * Created by hyunhunhwang on 2021. 02. 18.
 *
 * @swagger
 * definitions:
 *   OrderProduct:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: |
 *           구매 상품 uid
 *           * 상품 uid가 아닙니다.
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
 *       order_uid:
 *         type: number
 *         example: 2
 *         description: 구매 UID
 *       product_uid:
 *         type: number
 *         example: 2
 *         description: 상품 UID
 *       video_uid:
 *         type: number
 *         example: 2
 *         description: 리뷰영상 UID
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
 *       count:
 *         type: number
 *         example: 2
 *         description: 구매 수량
 *       price_original:
 *         type: number
 *         example: 20000
 *         description: 1개당 상품 원가
 *       payment:
 *         type: number
 *         example: 40000
 *         description: |
 *           총 지불 금액
 *           * price_original X count
 *       filename:
 *         type: string
 *         example: 'abcdefgh.png'
 *         description: 상품 이미지
 *
 */

