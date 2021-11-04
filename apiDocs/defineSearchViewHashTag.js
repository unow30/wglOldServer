/**
 * Created by yunhokim on 2021. 11. 04.
 *
 * @swagger
 * definitions:
 *   SearchViewHashTag:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: 검색한 해시태그 uid
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
 *         example: 테스트
 *         description: 검색한 해시태그 내용(#제외한 값 전송)
 *       count_video:
 *         type: number
 *         example: 10
 *         description: 검색한 해시태그를 가진 비디오 count
 *       video_count:
 *         type: number
 *         example: 71
 *         description: 업로드 영상 개수
 */

