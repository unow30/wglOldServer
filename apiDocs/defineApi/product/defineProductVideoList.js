/**
 * Created by hyunhunhwang on 2022. 01. 10.
 *
 * @swagger
 * definitions:
 *
 *   Proc_Array_ProductVideoList:
 *     allOf:
 *       - $ref: '#/definitions/VideoTable'
 *       - type: object
 *         properties:
 *           nickname:
 *             type: string
 *             example: "이건욱"
 *             description: 영상 올린 사람의 이름
 *           video_filename:
 *             type: string
 *             example: "ca590826fbcd192fd987a9b446b98abb.mov"
 *             description: 영상 파일명
 *           video_thumbnail:
 *             type: string
 *             example: "40e569f52df9ba2f51c695fdb3ce0bbbThumbnail.0000000.jpg"
 *             description: 영상 썸네일 파일명
 *           product_image:
 *             type: string
 *             example: "cddaad161993eca3b511f4729ea5cc89.png"
 *             description: 상품 이미지명
 *           image_filename:
 *             type: string
 *             example: "cddaad161993eca3b511f4729ea5cc89.png"
 *             description: 영상 파일명
 *           product_name:
 *             type: string
 *             example: 상품명입니다
 *             description: 상품명
 *           product_discount_price:
 *             type: number
 *             example: 4000
 *             description: 상품 할인 가격
 *           category:
 *             type: number
 *             example: 5
 *             description: |
 *               카테고리
 *               유저 관심사와 동일 (비트연산)
 *               * 1: 식품
 *               * 2: 뷰티, 주얼리
 *               * 4: 인테리어
 *               * 8: 패션, 잡화
 *           is_liked:
 *             type: number
 *             example: 0
 *             description: |
 *               좋아요 여부
 *               * 0: 비활성화
 *               * 1: 활성화
 *             enum: [0,1]
 *           is_follow:
 *             type: number
 *             example: 0
 *             description: |
 *               팔로우 여부
 *               * 0: 비활성화
 *               * 1: 활성화
 *             enum: [0,1]
 *
 *
 *   ProductVideoListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_ProductVideoList'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/product/${path}"
 *         description: api 경로
 *
 */
