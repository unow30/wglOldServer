/**
 * Created by gunucklee on 2022. 01. 05.
 *
 * @swagger
 * definitions:
 *   RecentViewedTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: recent viewed uid
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
 *         example: 3
 *         description: 유저 uid
 *       product_uid:
 *         type: number
 *         example: 24
 *         description: 상품 uid
 *       video_uid:
 *         type: number
 *         example: 131
 *         description: |
 *           리뷰 영상 uid
 *           - 리워드 주기 위한 필드
 *           - 0일 경우 리뷰 영상을 타고 들어온게 아님
 */
