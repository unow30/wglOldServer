/**
 * Created by hyunhunhwang on 2021. 01. 05.
 *
 * @swagger
 * definitions:
 *   Follow:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: 팔로우 uid
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
 *       source_uid:
 *         type: number
 *         example: 1
 *         description: 팔로우를 한 유저 UID
 *       target_uid:
 *         type: number
 *         example: 2
 *         description: 팔로우를 당한 유저 UID
 *       is_follow_with:
 *         type: number
 *         example: 0
 *         description: |
 *           맛팔 여부
 *           * 0: false
 *           * 1: true (맛팔)
 *         enum: [0,1]
 *       user_uid:
 *         type: number
 *         example: 2
 *         description: 팔로우를 당한 유저 UID
 *       nickname:
 *         type: string
 *         example: kakanick
 *         description: 팔로우를 당한 유저 닉네임
 *       filename:
 *         type: string
 *         example: abcdefg.jpg
 *         description: 팔로우를 당한 유저 프로필 이미지
 */
