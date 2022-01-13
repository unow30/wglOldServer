/**
 * Created by gunucklee on 2022. 01. 13.
 *
 * @swagger
 * definitions:
 *   Proc_Single_Point:
 *     type: object
 *     properties:
 *       total_point:
 *         type: number
 *         example: 3500
 *         description: 누적 포인트
 *       possible_point:
 *         type: number
 *         example: 500
 *         description: 현재 포인트
 *
 *   PointApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_Point'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/point/${path}"
 *         description: api 경로
 */