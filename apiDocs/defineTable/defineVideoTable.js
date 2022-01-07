/**
 * Created by gunucklee on 2022. 01. 05.
 *
 * @swagger
 * definitions:
 *   VideoTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 5
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
 *         description: 영상 등록한 유저 uid
 *       product_uid:
 *         type: number
 *         example: 7
 *         description: 상품 uid
 *       type:
 *         type: number
 *         example: 1
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
 *         example: "영상 내용 입니다."
 *         description: 영상 내용
 *       have_reward:
 *         type: string
 *         example: 0
 *         description: |
 *           리워드 지급여부
 *           type == 2 ( 리뷰 )일 경우에만 적용
 *           * 0: false ( 지급 안했음 )
 *           * 1: true ( 지급 했음 )
 *         enum: [0,1]
 *       count_shared:
 *         type: number
 *         example: 3
 *         description: |
 *           공유 횟수
 *           - 공유하기 클릭하는 순간 무조건 플러스 1이됨
 *           - 기준 아무것도 존재하지 않음
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
 *       is_authorize:
 *         type: number
 *         example: 0
 *         description: |
 *           승인 여부 (판매자 동영상만 적용)
 *           * 0: 대기 중
 *           * 1: 승인
 *         enum: [0,1]
 *       authorize_time:
 *         type: string
 *         example: 2021-01-07 08:52:23
 *         description: 승인된 시간
 *       requested_filename:
 *         type: string
 *         example: "5c6dd6636a6677461fc1e35cdfbeb0afConvertSuccess.mp4"
 *         description: 심사 요청한 영상 파일명
 *       is_recommend:
 *         type: number
 *         example: 0
 *         description: |
 *           추천 동영상 여부
 *           * 0: false
 *           * 1: true (추천 동영상)
 *         enum: [0,1]
 */
