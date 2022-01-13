/**
 * Created by gunucklee on 2022. 01. 11.
 *
 * @swagger
 * definitions:
 *   Proc_Single_VideoReview:
 *     allOf:
 *       - $ref: '#/definitions/VideoTable'
 *       - type: object
 *         properties:
 *           product_name:
 *             type: string
 *             example: "왕밤빵왕만두"
 *             description: 상품명
 *           is_deal:
 *             type: number
 *             example: 0
 *             description: |
 *               위글 딜 진행 여부
 *               * 0: 위글딜 아님
 *               * 1: 위글딜 진행 중
 *               * 2: 위글딜 심사 중
 *             enum: [0,1,2]
 *           seller_uid:
 *             type: number
 *             example: 12
 *             description: 판매자 uid
 *           reviewer_nickname:
 *             type: string
 *             example: "짱구"
 *             description: 리뷰어 닉네임
 *
 *   VideoReviewApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_VideoReview'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/video/${path}"
 *         description: api 경로
 */



