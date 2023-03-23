/**
 * Created by gunucklee on 2022. 01. 13.
 *
 * @swagger
 * definitions:
 *   Proc_Array_SearchViewRecommendList:
 *     allOf:
 *       - $ref: '#/definitions/ProductTable'
 *       - type: object
 *         properties:
 *           video_uid:
 *             type: number
 *             example: 5
 *             description: 영상 uid
 *           video_filename:
 *             type: string
 *             example: "ca590826fbcd192fd987a9b446b98abb.mp4"
 *             description: 영상 파일명
 *           video_count_like:
 *             type: number
 *             example: 0
 *             description: 좋아요 갯수
 *           count_shared:
 *             type: number
 *             example: 3
 *             description: 공유된 횟수
 *           count_comment:
 *             type: number
 *             example: 0
 *             description: 댓글 갯수
 *           content:
 *             type: string
 *             example: "영상 내용 입니다."
 *             description: 영상 내용
 *           count_view:
 *             type: number
 *             example: 3
 *             description: 조회 갯수
 *           nickname:
 *             type: string
 *             example: "강고문"
 *             description: 닉네임
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
 *           user_uid:
 *             type: number
 *             example: 1
 *             description: 유저 UID
 *           profile_filename:
 *             type: string
 *             example: "52b0d37685420f8ee043b9331b1fca25.png"
 *             description: 프로필 이미지
 *           image_filename:
 *             type: string
 *             example: "cddaad161993eca3b511f4729ea5cc89.png"
 *             description: 영상 올린 사람의 프로필 파일명
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
 *   SearchViewRecommendListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_SearchViewRecommendList'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/searchview/${path}"
 *         description: api 경로
 */



