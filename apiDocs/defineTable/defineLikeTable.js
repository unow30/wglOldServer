/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   LikeTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: like uid
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
 *         example: 2
 *         description: 유저 uid
 *       target_uid:
 *         type: number
 *         example: 13
 *         description: |
 *           타겟 uid
 *           Type 필드에 따라 테이블 처리
 *           * 1: 상품 찜하기 => 상품 테이블
 *           * 2: 영상 좋아요 => 영상 테이블
 *           * 3: 댓글 좋아요 => 댓글 테이블
 *           * 4: 대댓글 좋아요 => 대댓글 테이블
 *       type:
 *         type: number
 *         example: 3
 *         description: |
 *           좋아요(찜하기) 타입
 *           * 1: 상품 찜하기
 *           * 2: 영상 좋아요
 *           * 3: 댓글 좋아요
 *           * 4: 대댓글 좋아요
 *       video_uid:
 *         type: number
 *         example: 3
 *         description: 상품 찜하기 시 리워드를 전달할 video uid
 */
