/**
 * Created by hyunhunhwang on 2021. 01. 12.
 *
 * @swagger
 * definitions:
 *   ProductDetail:
 *     type: object
 *     properties:
 *       item:
 *         $ref: '#/definitions/Product'
 *       image_list:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Image'
 *       review_list:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Review'
 *       faq_list:
 *         type: array
 *         items:
 *           $ref: '#/definitions/FAQ'
 *       qna_list:
 *         type: array
 *         items:
 *           $ref: '#/definitions/QnA'
 *
 */
