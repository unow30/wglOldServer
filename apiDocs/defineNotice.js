/**
 * Created by yunhokim on 2021. 10. 20.
 *
 * @swagger
 * definitions:
 *   Notice:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: 공지사항 uid
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
 *       admin_user_uid:
 *         type: number
 *         example: 1
 *         description: 공지 업로드 관리자
 *       title:
 *         type: string
 *         example: 첫 공지사항
 *         description: 공지 제목
 *       content:
 *         type: string
 *         example: 안녕하세요 위글 판매자 사이트 담당자입니다.~
 *         description: 공지 내용
 *       category:
 *         type: string
 *         example: 공지사항
 *         description: |
 *           공지사항
 *           * 공지사항: 공지사항
 *           * 이벤트: 이벤트
 *           * 업데이트: 업데이트
 *       status:
 *         type: int
 *         example: 1
 *         description: |
 *           업로드 상태
 *           * 1: 위글 앱
 *           * 2: 위글 판매자페이지
 *           * 10: 모든 위치
 *       nickname:
 *         type: string
 *         example: 위글담당자
 *         description: 관리자 닉네임
 *
 */
