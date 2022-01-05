/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   AdTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: Ad uid
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
 *         example: 2
 *         description: 광고 상품 uid
 *       start_time:
 *         type: string
 *         example: 2021-01-01 10:00:00
 *         description: 광고 시작 날짜 및 시간
 *       end_time:
 *         type: string
 *         example: 2021-02-01 00:00:00
 *         description: 광고 종료 날짜 및 시간
 *       is_authorize:
 *         type: number
 *         example: 0
 *         description: |
 *           승인 여부
 *           * 0: 대기중
 *           * 1: 승인
 *         enum: [0,1]
 */
