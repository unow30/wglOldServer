/**
 * Created by gunucklee on 2022. 01. 05.
 *
 * @swagger
 * definitions:
 *   Proc_Single_User:
 *     allOf:
 *       - $ref: '#/definitions/UserTable'
 *       - type: object
 *         properties:
 *           follower_count:
 *             type: number
 *             example: 1234
 *             description: 팔로워 카운트
 *           following_count:
 *             type: number
 *             example: 2
 *             description: 팔로잉 카운트
 *           video_count:
 *             type: number
 *             example: 0
 *             description: 영상 카운트
 *           filename:
 *             type: string
 *             example: "abcdefg.jpg"
 *             description: 프로필 파일 명
 *
 *
 *   UserApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_User'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/public/user/${path}"
 *         description: api 경로
 */
