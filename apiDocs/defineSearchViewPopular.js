/**
 * Created by yunhokim on 2021. 11. 04.
 *
 * @swagger
 * definitions:
 *   SearchViewPopular:
 *     type: object
 *     properties:
 *       video_uid:
 *         type: number
 *         example: 1
 *         description: 검색한 인기영상 uid
 *       video_filename:
 *         type: string
 *         example: 7672463bd5517945a1ed12c06c41986fConvertSuccess.mp4
 *         description: 검색한 인기영상 video_filename
 *       video_thumbnail:
 *         type: string
 *         example: 7672463bd5517945a1ed12c06c41986fThumbnail.0000000.jpg
 *         description: 검색한 인기영상 video_thumbnail
 *       video_count:
 *         type: number
 *         example: 21
 *         description: 검색한 인기영상 조회수
 *       video_type:
 *         type: number
 *         example: 1
 *         description: |
 *           검색한 인기영상 타입
 *           * 1: 판매자 영상
 *           * 2: 리뷰어 영상
 *         enum: [0,1]
 *       product_uid:
 *         type: number
 *         example: 4
 *         description: 검색한 인기영상 상품 uid
 *       product_name:
 *         type: string
 *         example: 테스트 - 가율 연어장
 *         description: 검색한 인기영상 상품명
 *       user_uid:
 *         type: number
 *         example: 1
 *         description: 검색한 인기영상 업로더 uid
 *       user_nickname:
 *         type: string
 *         example: 식스레시피
 *         description: 검색한 인기영상 업로더 닉네임
 *       profile_filename:
 *         type: string
 *         example: ca7d123e9b01b6a90ff77f9b11b8df96.jpg
 *         description: 검색한 인기영상 상품 업로더 profile_filename
 */

