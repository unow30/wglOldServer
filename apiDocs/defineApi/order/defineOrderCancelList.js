/**
 * Created by gunucklee on 2022. 01. 06.
 *
 * @swagger
 * definitions:
 *   proc_select_order_cancel_list:
 *     allOf:
 *       - $ref: '#/definitions/OrderTable'
 *       - type: object
 *         properties:
 *
 *
 *   ProductConfirmListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_ProductConfirmList'
 *       total_count:
 *         type: number
 *         example: 1
 *         description: 리스트 개수
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/product/${path}"
 *         description: api 경로
 */



