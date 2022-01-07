/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   HashTagTable:
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
 *       tag:
 *         type: string
 *         example: "스키야키"
 *         description: 해시태그
 *       video_count:
 *         type: number
 *         example: 14
 *         description: |
 *           해시태그 비디오 카운트
 *           * 비디오 내용에 해시태그 생성: 카운트 + 1
 *             비디오 삭제: 카운트 -1
 */
