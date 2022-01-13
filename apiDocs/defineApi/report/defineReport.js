/**
 * Created by gunucklee on 2022. 01. 13.
 *
 * @swagger
 * definitions:
 *   Proc_Single_Report:
 *     allOf:
 *       - $ref: '#/definitions/ReportTable'
 *
 *   ReportApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_Report'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/report/${path}"
 *         description: api 경로
 */



