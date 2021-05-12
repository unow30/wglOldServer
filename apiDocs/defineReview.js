/**
 * Created by hyunhunhwang on 2021. 01. 12.
 *
 * @swagger
 * definitions:
 *   Review:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: 리뷰 영상 uid
 *       is_deleted:
 *         type: number
 *         example: 0
 *         description: |
 *           삭제 여부
 *           * 0: false
 *           * 1: true (삭제됨)
 *         enum: [0,1]
 *       created_time:
 *         type: string
 *         example: 2021-01-07 08:52:23
 *         description: 최초 생성 날짜
 *       updated_time:
 *         type: string
 *         example: 2021-01-07 08:52:23
 *         description: 마지막 수정한 날짜
 *       user_uid:
 *         type: number
 *         example: 3
 *         description: 이미지 등록한 유저 uid
 *       product_uid:
 *         type: number
 *         example: 7
 *         description: 상품 uid
 *       type:
 *         type: number
 *         example: 2
 *         description: |
 *           영상 타입
 *           * 1: 판매자가 올린 영상
 *           * 2: 리뷰어가 올린 영상
 *         enum: [1,2]
 *       filename:
 *         type: string
 *         example: "ca590826fbcd192fd987a9b446b98abb.mov"
 *         description: 영상 파일명
 *       content:
 *         type: string
 *         example: "리뷰 영상 내용 입니다."
 *         description: 리뷰 영상 내용
 *       count_shared:
 *         type: number
 *         example: 3
 *         description: 공유 횟수
 *       count_comment:
 *         type: number
 *         example: 3
 *         description: 댓글 갯수
 *       count_like:
 *         type: number
 *         example: 3
 *         description: 좋아요 갯수
 *       count_view:
 *         type: number
 *         example: 3
 *         description: 조회 갯수
 *       nickname:
 *         type: string
 *         example: "nick"
 *         description: 리뷰 영상 등록 유저 닉네임
 *       video_filename:
 *         type: string
 *         example: "ca590826fbcd192fd987a9b446b98abb.mov"
 *         description: 리뷰 영상 파일명
 *       image_filename:
 *         type: string
 *         example: "cddaad161993eca3b511f4729ea5cc89.png"
 *         description: 리뷰 영상 등록 유저 프로필 이미지
 */


