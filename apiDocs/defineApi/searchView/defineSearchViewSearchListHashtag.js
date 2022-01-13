/**
 * Created by gunucklee on 2022. 01. 13.
 *
 * @swagger
 * definitions:
 *   Proc_Array_SearchViewListHashtag:
 *     allOf:
 *       - $ref: '#/definitions/HashTagTable'
 *
 *   SearchViewListHashtagApi:
 *     type: object
 *     properties:
 *       hash_tag_list:
 *           $ref: '#/definitions/Proc_Array_SearchViewListHashtag'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/searchview/${path}"
 *         description: api 경로
 */



