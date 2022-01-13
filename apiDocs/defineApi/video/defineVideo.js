/**
 * Created by gunucklee on 2022. 01. 11.
 *
 * @swagger
 * definitions:
 *   Proc_Single_Video:
 *     allOf:
 *       - $ref: '#/definitions/VideoTable'
 *
 *   VideoApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_Video'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/video/${path}"
 *         description: api 경로
 */



