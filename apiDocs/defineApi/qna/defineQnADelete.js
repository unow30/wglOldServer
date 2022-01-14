/**
 * Created by gunucklee on 2022. 01. 06.
 *
 * @swagger
 * definitions:
 *   Proc_Single_QnADelete:
 *     allOf:
 *       - $ref: '#/definitions/ProductQnaTable'
 *
 *   QnADeleteApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_QnADelete'
 *       success:
 *         type: string
 *         example: "삭제가 완료되었습니다."
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/qna/${path}"
 *         description: api 경로
 */



