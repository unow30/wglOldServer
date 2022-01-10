/**
 * Created by gunucklee on 2022. 01. 05.
 *
 * @swagger
 * definitions:
 *
 *   Proc_Array_UserProfileReviewList:
 *     allOf:
 *       - $ref: '#/definitions/VideoTable'
 *       - type: object
 *         properties:
 *           video_uid:
 *             type: number
 *             example: 5
 *             description: 리뷰 영상 uid
 *           name:
 *             type: string
 *             example: "왕밤빵왕만두"
 *             description: 상품명
 *           sale_type:
 *             type: string
 *             example: "onsale"
 *             description: |
 *               판매 타입
 *               * onsale: 판매중
 *               * soldout: 판매 완료(품절)
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
 *           product_discount_price:
 *             type: number
 *             example: 4000
 *             description: 상품 할인 가격
 *           video_filename:
 *             type: string
 *             example: "ca590826fbcd192fd987a9b446b98abb.mov"
 *             description: 리뷰 영상 파일명
 *           video_thumbnail:
 *             type: string
 *             example: "40e569f52df9ba2f51c695fdb3ce0bbbThumbnail.0000000.jpg"
 *             description: 리뷰 영상 썸네일 파일명
 *           nickname:
 *             type: string
 *             example: "nick"
 *             description: 리뷰 영상 등록 유저 닉네임
 *           image_filename:
 *             type: string
 *             example: "cddaad161993eca3b511f4729ea5cc89.png"
 *             description: 리뷰 영상 등록 상품 이미지
 *           profile_filename:
 *             type: string
 *             example: "52b0d37685420f8ee043b9331b1fca25.png"
 *             description: 리뷰 영상 등록 유저 프로필 이미지
 *           is_follow:
 *             type: number
 *             example: 0
 *             description: |
 *               팔로우 여부
 *               * 0: 비활성화
 *               * 1: 활성화
 *             enum: [0,1]
 *           is_liked:
 *             type: number
 *             example: 0
 *             description: |
 *               좋아요 여부
 *               * 0: 비활성화
 *               * 1: 활성화
 *             enum: [0,1]
 *           reward_amount:
 *             type: number
 *             example: 10000
 *             description: 해당 영상의 리워드 합계 금액
 *           reward_count:
 *             type: number
 *             example: 100
 *             description: 해당 영상의 리워드 합계 갯수
 *
 *   UserProfileReviewListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_UserProfileReviewList'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/user/${path}"
 *         description: api 경로
 */


