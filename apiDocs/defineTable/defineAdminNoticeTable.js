/**
 * Created by gunucklee on 2022. 01. 13.
 *
 * @swagger
 * definitions:
 *   AdminNoticeTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: Admin Notice uid
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
 *       title:
 *         type: number
 *         example: 2
 *         description: 공지 제목
 *       content:
 *         type: string
 *         example: "공지 내용입니다."
 *         description: 공지 내용
 *       category:
 *         type: string
 *         example: "공지 종류입니다.
 *         description: 공지 종류
 *       admin_user_uid:
 *         type: number
 *         example: 1
 *         description: 공지 업로드 관리자
 *       status:
 *         type: number
 *         example: 0
 *         description: |
 *           업로드 위치
 *           * 1: 위글 앱
 *           * 2: 위글 판매자페이지
 *           * 10: 모든 위치
 */
