/**
 * Created by gunucklee on 2022. 01. 13.
 *
 * @swagger
 * definitions:
 *   Proc_Array_LikeProductList:
 *     allOf:
 *       - $ref: '#/definitions/LikeTable'
 *       - type: object
 *         properties:
 *           product_uid:
 *             type: number
 *             example: 5
 *             description: 상품 uid
 *           name:
 *             type: string
 *             example: "상풍명입니다."
 *             description: 상품명
 *           price_original:
 *             type: number
 *             example: 3000
 *             description: 상품 원가
 *           is_deal:
 *             type: number
 *             example: 0
 *             description: |
 *               위글 딜 진행 여부
 *               * 0: 위글딜 아님
 *               * 1: 위글딜 진행 중
 *               * 2: 위글딜 심사 중
 *             enum: [0,1,2]
 *           sale_type:
 *             type: string
 *             example: "onsale"
 *             description: |
 *               판매 타입
 *               * onsale: 판매중
 *               * soldout: 판매 완료(품절)
 *           video_user_uid:
 *             type: number
 *             example: 13
 *             description: 영상 올린 유저 uid
 *           nickname:
 *             type: string
 *             example: "nickch"
 *             description: 닉네임
 *           product_filename:
 *             type: string
 *             example: "52b0d37685420f8ee043b9331b1fca25.png"
 *             description: 상품 이미지
 *           content:
 *             type: string
 *             example: "영상 내용 입니다."
 *             description: 영상 내용
 *           count_shared:
 *             type: number
 *             example: 3
 *             description: 공유된 횟수
 *           count_comment:
 *             type: number
 *             example: 0
 *             description: 댓글 갯수
 *           count_like:
 *             type: number
 *             example: 3
 *             description: 좋아요 갯수
 *           count_view:
 *             type: number
 *             example: 3
 *             description: 조회 갯수
 *           video_filename:
 *             type: string
 *             example: "ca590826fbcd192fd987a9b446b98abb.mov"
 *             description: 영상 파일명
 *           video_thumbnail:
 *             type: string
 *             example: "40e569f52df9ba2f51c695fdb3ce0bbbThumbnail.0000000.jpg"
 *             description: 영상 썸네일 파일명
 *           profile_image:
 *             type: string
 *             example: "52b0d37685420f8ee043b9331b1fca25.png"
 *             description: 프로필 이미지
 *           is_follow:
 *             type: number
 *             example: 0
 *             description: |
 *               내 팔로우 여부
 *               * 0: 팔로우 안함
 *               * 1: 팔로우 함
 *             enum: [0,1]
 *           is_liked:
 *             type: number
 *             example: 0
 *             description: |
 *               내 좋아요 여부
 *               * 0: 좋아요 안함
 *               * 1: 좋아요 함
 *             enum: [0,1]
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
 *
 *
 *   LikeProductListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_LikeProductList'
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
 *         example: "/api/private/like/${path}"
 *         description: api 경로
 */



