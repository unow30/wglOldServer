/**
 * Created by gunucklee on 2022. 01. 10.
 *
 * @swagger
 * definitions:
 *   FcmAlertTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: FcmAlert uid
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
 *       fcm_type:
 *         type: number
 *         example: 8
 *         description: |
 *           fcm 알림 타입
 *           fcm_type
 *           위글 앱
 *           * 0: 위글 주문 알림 -> 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
 *           * 1: 리뷰 영상 등록 알림
 *           * 2: 리워드 지급 알림
 *           * 3: 댓글 등록 알림
 *           * 4: 대댓글 등록 알림
 *           * 5: 문의 등록 알림
 *           * 6: 위글가입 포인트 알림
 *           판매자사이트
 *           * 0: 주문 상품 상태 알림 -> 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
 *           * 7: 문의사항 답변 등록 알림
 *           관리자사이트
 *           * 8: 위글 리뷰영상 이벤트 알림
 *           * 0: 위글 리뷰영상 이벤트 심사 거절 -> 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
 *       title:
 *         type: string
 *         example: "위글 리뷰영상 이벤트 심사 승인"
 *         description: fcm 알림 제목
 *       message:
 *         type: string
 *         example: "리뷰영상이 심사에 통과하지 못하여 포인트 지급이 거절되었습니다. 사유:넌 죄가 많아 나쁜놈"
 *         description: fcm 알림 메시지
 *       target_uid:
 *         type: number
 *         example: 0
 *         description: |
 *           타겟 uid
 *           fcm 알림 타입에 따라 타겟 uid 변경
 *           fcm_type: 0일 경우에는 위글 앱 실행
 *           위글 앱
 *           * 0: 위글 주문 알림 => 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
 *           * 1: 리뷰 영상 등록 알림 => 받는 uid 없음 0저장
 *           * 2: 리워드 지급 알림 => 리워드 uid
 *           * 3: 댓글 등록 알림 => 댓글 uid
 *           * 4: 대댓글 등록 알림 => 대댓글 uid
 *           * 5: 문의 등록 알림 => 문의 uid
 *           * 6: 위글가입 포인트 알림 => 포인트 uid
 *           판매자사이트
 *           * 0: 주문 상품 상태 알림 => 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
 *           * 7: 문의사항 답변 등록 알림 => 문의 uid
 *           관리자사이트
 *           * 8: 위글 리뷰영상 이벤트 심사 승인 => 받는 uid 없음 0저장
 *           * 0: 위글 리뷰영상 이벤트 심사 거절 => 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
 *       user_uid:
 *         type: number
 *         example: 24
 *         description: 알림 받은 유저 uid
 *       video_uid:
 *         type: number
 *         example: 30
 *         description: 영상 Uid
 *
 */
