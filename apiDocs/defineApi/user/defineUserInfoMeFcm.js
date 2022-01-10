/**
 * Created by gunucklee on 2022. 01. 10.
 *
 * @swagger
 * definitions:
 *
 *   Proc_Array_UserInfoMeFCM:
 *     allOf:
 *       - $ref: '#/definitions/FcmAlertTable'
 *       - type: object
 *         properties:
 *           profile_image:
 *             type: string
 *             example: "abcdefg.jpg"
 *             description: 프로필 파일 명
 *
 *   UserInfoMeFCMApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_UserInfoMeFCM'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/user/${path}"
 *         description: api 경로
 *
 */
