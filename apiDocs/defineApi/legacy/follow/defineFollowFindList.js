/**
 * Created by gunucklee on 2022. 01. 11.
 *
 * @swagger
 * definitions:
 *   Proc_Array_FollowFindList:
 *     allOf:
 *       - $ref: '#/definitions/FollowTable'
 *       - type: object
 *         properties:
 *           is_follow_with:
 *             type: number
 *             example: 0
 *             description: |
 *               맛팔 여부
 *               * 0: false
 *               * 1: true (맛팔)
 *             enum: [0,1]
 *           user_uid:
 *             type: number
 *             example: 1
 *             description: 배송지 소유자 유저 UID
 *           nickname:
 *             type: string
 *             example: "강고문"
 *             description: 닉네임
 *           filename:
 *             type: string
 *             example: "abcdefg.jpg"
 *             description: 유저 프로필 파일명
 *
 *   FollowFindListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_FollowFindList'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/follow/${path}"
 *         description: api 경로
 */



