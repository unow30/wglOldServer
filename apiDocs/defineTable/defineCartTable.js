/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   CartTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: Cart uid
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
 *         example: 2
 *         description: 유저 uid
 *       seller_uid:
 *         type: number
 *         example: 14
 *         description: 판매자 유저 uid
 *       product_uid:
 *         type: number
 *         example: 2
 *         description: 상품 uid
 *       video_uid:
 *         type: number
 *         example: 2
 *         description: 상품 uid
 *       option_ids:
 *         type: string
 *         example: "101,203,301"
 *         description: 옵션 목록
 *       count:
 *         type: number
 *         example: 2
 *         description: 구매 갯수
 *       option_names:
 *         type: string
 *         example: "술고래 술잔세트 4p,벚꽃 술잔세트 4p,술고래 2p + 벚꽃 2p"
 *         description: 옵션 목록 이름
 */
