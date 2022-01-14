/**
 * Created by gunucklee on 2022. 01. 13.
 *
 * @swagger
 * definitions:
 *   Proc_Single_QnAUpdate:
 *     allOf:
 *       - $ref: '#/definitions/ProductQnaTable'
 *
 *   QnAUpdateApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_QnAUpdate'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/qna/${path}"
 *         description: api 경로
 */



