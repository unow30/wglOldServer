/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   CommentTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: Cart uid
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
 *         example: 14
 *         description: |
 *           타겟 uid
 *           * type 에 따라 테이블 변경
 *           1: 영상 댓글 => 영상 테이블
 *       type:
 *         type: number
 *         example: 1
 *         description: |
 *           댓글 타입
 *           * 1: 영상 댓글
 *       content:
 *         type: string
 *         example: "간다 간다 쑝간다~~~~~"
 *         description: 댓글 내용
 *       seller_comment_unread:
 *         type: number
 *         example: 0
 *         description: |
 *           판매자 댓글 읽음 표시
 *           * 0: 안읽음
 *           * 1: 읽음
 *         enum: [0,1]
 */
