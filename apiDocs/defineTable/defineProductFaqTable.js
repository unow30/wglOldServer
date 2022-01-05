/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   ProductFaqTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: product faq uid
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
 *         description: 상품 uid
 *       title:
 *         type: string
 *         example: "이거 좀 잘 안되는데 해결 좀 해주세요."
 *         description: 제목
 *       content:
 *         type: string
 *         example: "낚시임 ㅋ"
 *         description: 답변 내용
 */
