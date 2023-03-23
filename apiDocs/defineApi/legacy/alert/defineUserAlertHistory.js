/**
 * Created by yunhokim on 2022. 01. 21.
 *
 * @swagger
 * definitions:
 *   Proc_Array_UserAlertHistory:
 *     allOf:
 *       - $ref: '#/definitions/FcmAlertTable'
 *       - type: object
 *         properties:
 *           profile_image:
 *             type: string
 *             example: "abcdefg.jpg"
 *             description: 프로필 파일 명
 *
 *   UserAlertHistoryApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_UserAlertHistory'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/alert/${path}"
 *         description: api 경로
 *
 */
