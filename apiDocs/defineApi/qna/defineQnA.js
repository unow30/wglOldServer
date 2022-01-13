/**
 * Created by gunucklee on 2022. 01. 06.
 *
 * @swagger
 * definitions:
 *   Proc_Single_QnA:
 *     allOf:
 *       - $ref: '#/definitions/ProductQnaTable'
 *       - type: object
 *         properties:
 *           product_name:
 *             type: string
 *             example: "왕밤빵왕만두"
 *             description: 상품명
 *
 *   QnAApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_QnA'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/qna/${path}"
 *         description: api 경로
 */



