/**
 * Created by hyunhunhwang on 2021. 01. 12.
 *
 * @swagger
 * definitions:
 *   FAQ:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: faq uid
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
 *       product_uid:
 *         type: number
 *         example: 7
 *         description: 상품 uid
 *       title:
 *         type: string
 *         example: "faq 제목입니다."
 *         description: faq 제목
 *       content:
 *         type: string
 *         example: "faq 내용입니다."
 *         description: faq 내용
 */


