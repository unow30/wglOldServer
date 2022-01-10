/**
 * Created by gunucklee on 2022. 01. 05.
 *
 * @swagger
 * definitions:
 *
 *   Proc_Array_ProductRecentViewed:
 *     allOf:
 *       - $ref: '#/definitions/RecentViewedTable'
 *       - type: object
 *         properties:
 *           video_uid:
 *             type: number
 *             example: 5
 *             description: 리뷰 영상 uid
 *           product_image:
 *             type: string
 *             example: "cddaad161993eca3b511f4729ea5cc89.png"
 *             description: 상품 이미지명
 *           name:
 *             type: string
 *             example: '테스트 상품'
 *             description: 상품명
 *           nickname:
 *             type: string
 *             example: 이건욱
 *             description: 닉네임
 *           profile_filename:
 *             type: string
 *             example: "52b0d37685420f8ee043b9331b1fca25.png"
 *             description: 프로필 이미지
 *           product_price_discount:
 *             type: number
 *             example: 4000
 *             description: 상품 할인 가격
 *
 *   ProductRecentViewedApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_ProductRecentViewed'
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
 *
 *
 */