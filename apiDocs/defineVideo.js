/**
 * Created by hyunhunhwang on 2021. 01. 11.
 *
 * @swagger
 * definitions:
 *   Video:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: 팔로우 uid
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
 *         example: 2021-01-01 00:00:00
 *         description: 최초 생성 날짜
 *       updated_time:
 *         type: string
 *         example: 2021-01-01 00:00:00
 *         description: 마지막 수정한 날짜
 *       user_uid:
 *         type: number
 *         example: 1
 *         description: 영상 작성자 유저 UID
 *       product_uid:
 *         type: number
 *         example: 1
 *         description: 영상 타겟 상품 UID
 *       type:
 *         type: number
 *         example: 1
 *         description: |
 *           영상 타입
 *           * 1: 판매자가 올린 영상
 *           * 2: 리뷰어가 올린 영상
 *         enum: [1,2]
 *       content:
 *         type: string
 *         example: "영상 내용입니다."
 *         description: 영상 내용
 *       count_shared:
 *         type: number
 *         example: 1
 *         description: 영상 공유횟수
 *       count_comment:
 *         type: number
 *         example: 0
 *         description: 댓글 갯수
 *       count_like:
 *         type: number
 *         example: 0
 *         description: 좋아요 갯수
 *       name:
 *         type: string
 *         example: "상품명"
 *         description: 상품명
 *       nickname:
 *         type: string
 *         example: "nick"
 *         description: 판매자 닉네임
 *       image_filename:
 *         type: string
 *         example: "cddaad161993eca3b511f4729ea5cc89.png"
 *         description: 판매자 프로필 이미지
 *       video_filename:
 *         type: string
 *         example: "ca590826fbcd192fd987a9b446b98abb.mov"
 *         description: 영상 파일명
 *       is_follow:
 *         type: number
 *         example: 0
 *         description: |
 *           내 팔로우 여부
 *           * 0: 팔로우 안함
 *           * 1: 팔로우 함
 *         enum: [0,1]
 *       is_liked:
 *         type: number
 *         example: 0
 *         description: |
 *           내 좋아요 여부
 *           * 0: 좋아요 안함
 *           * 1: 좋아요 함
 *         enum: [0,1]
 */

