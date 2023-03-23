/**
 * Created by gunucklee on 2022. 01. 13.
 *
 * @swagger
 * definitions:
 *   Proc_Single_LikeUpdateApi:
 *     type: object
 *     properties:
 *       like_count:
 *         type: number
 *         example: 214
 *         description: 좋아요 갯수
 *
 *   LikeUpdateApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_LikeUpdateApi'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/like/${path}"
 *         description: api 경로
 */