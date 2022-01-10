/**
 * Created by gunucklee on 2022. 01. 05.
 *
 * @swagger
 * definitions:
 *   Proc_Array_FeedList:
 *     allOf:
 *       - $ref: '#/definitions/VideoTable'
 *       - type: object
 *         properties:
 *           video_uid:
 *             type: number
 *             example: 5
 *             description: 리뷰 영상 uid
 *           video_filename:
 *             type: string
 *             example: "ca590826fbcd192fd987a9b446b98abb.mov"
 *             description: 영상 파일명
 *           video_thumbnail:
 *             type: string
 *             example: "40e569f52df9ba2f51c695fdb3ce0bbbThumbnail.0000000.jpg"
 *             description: 영상 썸네일 파일명
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
 *           product_name:
 *             type: string
 *             example: "왕밤빵왕만두"
 *             description: 상품명
 *           product_user_uid:
 *             type: number
 *             example: 1
 *             description: 상품 판매자 유저 uid
 *           product_discount_price:
 *             type: number
 *             example: 4000
 *             description: 상품 할인 가격
 *           nickname:
 *             type: string
 *             example: nick
 *             description: 판매자 유저 닉네임
 *           address:
 *             type: string
 *             example: 어디어디
 *             description: 판매자 주소
 *           latitude:
 *             type: number
 *             example: 36.3059899
 *             description: 판매자 위치 - 위도
 *           longitude:
 *             type: number
 *             example: 126.5318063
 *             description: 판매자 위치 - 경도
 *           profile_filename:
 *             type: string
 *             example: "52b0d37685420f8ee043b9331b1fca25.png"
 *             description: 영상 등록 유저 프로필 이미지
 *           image_filename:
 *             type: string
 *             example: cddaad161993eca3b511f4729ea5cc89.png
 *             description: 상품 이미지 파일명
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
 *           product_count:
 *             type: number
 *             example: 2
 *             description: 동일 카테고리 상품 갯수
 *           distance:
 *             type: number
 *             example: 142
 *             description: 유저와의 거리(단위 km)
 *
 *   FeedListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_FeedList'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/feed/${path}"
 *         description: api 경로
 */

