/**
 * Created by gunucklee on 2021.01. 05.
 *
 * @swagger
 * definitions:
 *   Proc_Array_WeggleDealList:
 *     allOf:
 *       - $ref: '#/definitions/ProductTable'
 *       - type: object
 *         properties:
 *           product_uid:
 *             type: number
 *             example: 5
 *             description: 상품 uid
 *           video_uid:
 *             type: number
 *             example: 13
 *             description: 영상 uid
 *           count_shared:
 *             type: number
 *             example: 3
 *             description: 공유된 횟수
 *           video_count_like:
 *             type: number
 *             example: 0
 *             description: 좋아요 갯수
 *           count_comment:
 *             type: number
 *             example: 0
 *             description: 댓글 갯수
 *           count_view:
 *             type: number
 *             example: 3
 *             description: 조회 갯수
 *           video_filename:
 *             type: string
 *             example: "ca590826fbcd192fd987a9b446b98abb.mov"
 *             description: 영상 파일명
 *           content:
 *             type: string
 *             example: "영상 내용 입니다."
 *             description: 영상 내용
 *           image_filename:
 *             type: string
 *             example: "cddaad161993eca3b511f4729ea5cc89.png"
 *             description: 상품 이미지 파일명
 *           nickname:
 *             type: string
 *             example: 이건욱
 *             description: 판매자 닉네임
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
 *           video_thumbnail:
 *             type: string
 *             example: "40e569f52df9ba2f51c695fdb3ce0bbbThumbnail.0000000.jpg"
 *             description: 영상 썸네일 파일명
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
 *           profile_filename:
 *             type: string
 *             example: "52b0d37685420f8ee043b9331b1fca25.png"
 *             description: 판매자 프로필 이미지
 *
 *   WeggleDealListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_WeggleDealList'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/weggledeal/${path}"
 *         description: api 경로
 */

