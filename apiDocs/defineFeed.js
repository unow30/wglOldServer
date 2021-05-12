/**
 * Created by hyunhunhwang on 2021. 01. 08.
 *
 * @swagger
 * definitions:
 *   Feed:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 33
 *         description: 영상 uid
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
 *         description: 영상 작성자 유저 UID
 *       product_uid:
 *         type: number
 *         example: 7
 *         description: 영상 대상 상품 UID
 *       type:
 *         type: number
 *         example: 2
 *         description: |
 *           영상 타입
 *           * 1: 판매자가 올린 영상
 *           * 2: 리뷰어가 올린 영상
 *         enum: [1,2]
 *       content:
 *         type: string
 *         example: "테스트 상품 #핸드폰 #귀걸이"
 *         description: 영상에 작성된 내용
 *       count_shared:
 *         type: number
 *         example: 3
 *         description: 공유된 횟수
 *       count_comment:
 *         type: number
 *         example: 2
 *         description: 댓글 갯수
 *       count_like:
 *         type: number
 *         example: 0
 *         description: 좋아요 갯수
 *       video_filename:
 *         type: string
 *         example: ca590826fbcd192fd987a9b446b98abb.mov
 *         description: 영상 파일명
 *       category:
 *         type: number
 *         example: 4
 *         description: |
 *           상품 카테고리
 *           * 1: 수제 먹거리
 *           * 2: 음료
 *           * 4: 인테리어 소품
 *           * 8: 악세사리
 *           * 16: 휴대폰 주변기기
 *           * 32: 비누/캔들
 *           * 64: 가죽 공예
 *           * 128: 꽃
 *           * 256: 반려견
 *         enum: [1,2,4,8,16,32,64,128,256]
 *       product_name:
 *         type: string
 *         example: 상품명입니다
 *         description: 상품명
 *       product_user_uid:
 *         type: number
 *         example: 1
 *         description: 상품 판매자 유저 uid
 *       image_filename:
 *         type: string
 *         example: cddaad161993eca3b511f4729ea5cc89.png
 *         description: 상품 이미지 파일명
 *       nickname:
 *         type: string
 *         example: nick
 *         description: 판매자 유저 닉네임
 *       address:
 *         type: string
 *         example: 어디어디
 *         description: 판매자 주소
 *       latitude:
 *         type: number
 *         example: 36.3059899
 *         description: 판매자 위치 - 위도
 *       longitude:
 *         type: number
 *         example: 126.5318063
 *         description: 판매자 위치 - 경도
 *       product_count:
 *         type: number
 *         example: 2
 *         description: 동일 카테고리 상품 갯수
 *       distance:
 *         type: number
 *         example: 142
 *         description: 유저와의 거리(단위 km)
 */

