/**
 * Created by hyunhunhwang on 2021. 01. 11.
 *
 * @swagger
 * definitions:
 *   Comment:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: 댓글 uid
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
 *         description: 댓글 작성자 유저 UID
 *       target_uid:
 *         type: number
 *         example: 2
 *         description: 영상 UID
 *       type:
 *         type: number
 *         example: 1
 *         description: |
 *           댓글 타입
 *           * 1: 영상 댓글
 *         enum: [1]
 *       content:
 *         type: string
 *         example: 댓글 내용입니다.
 *         description: 댓글 내용
 *       filename:
 *         type: string
 *         example: abcdefg.jpg
 *         description: 팔로우를 당한 유저 프로필 이미지
 *       is_liked:
 *         type: number
 *         example: 1
 *         description: |
 *           내 좋아요 여부
 *           * 0: false (좋아요 안함)
 *           * 1: true (좋아요 함)
 *         enum: [0,1]
 *       count_like:
 *         type: number
 *         example: 5
 *         description: 좋아요 갯수
 */

