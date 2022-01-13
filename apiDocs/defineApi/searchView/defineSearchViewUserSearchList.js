/**
 * Created by gunucklee on 2022. 01. 13.
 *
 * @swagger
 * definitions:
 *   Proc_Array_SearchViewUserSearchList:
 *     type: object
 *     properties:
 *       user_uid:
 *         type: number
 *         example: 9
 *         description: 유저 uid
 *       user_nickname:
 *         type: string
 *         example: "고릴라짱짱"
 *         description: 유저 닉네임
 *       profile_filename:
 *         type: string
 *         example: "52b0d37685420f8ee043b9331b1fca25.png"
 *         description: 프로필 이미지
 *       follow_count:
 *         type: number
 *         example: 13
 *         description: 팔로워 갯수
 *       video_count:
 *         type: number
 *         example: 4
 *         description: 영상 카운트
 *
 *   SearchViewUserSearchListApi:
 *     type: object
 *     properties:
 *       user_list:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_SearchViewUserSearchList'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/searchview/${path}"
 *         description: api 경로
 */