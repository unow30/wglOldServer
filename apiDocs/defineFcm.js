/**
 * Created by yunhokim on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   Fcm:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: 알림 uid
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
 *       alarm_type:
 *         type: number
 *         example: 1
 *         description: |
 *           fcm 알림 타입
 *           * 위글 앱 서버 실행
 *               * 0: 위글 주문 알림 => 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
 *               * 1: 리뷰 영상 등록 알림
 *               * 2: 리워드 지급 알림
 *               * 3: 댓글 등록 알림
 *               * 4: 대댓글 등록 알림
 *               * 5: 문의 등록 알림 => 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
 *               * 6: 위글가입 포인트 알림
 *               * 7: 구매 확정 알림 => 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
 *
 *           * 판매자사이트 서버 실행
 *               * 8: 배송 시작 알림
 *               * 9: 구매 확정 요청 알림
 *               * 10: 문의사항 답변 등록 알림
 *               * 11: 선물 기한 알림
 *
 *           * 관리자사이트 서버 실행
 *               * 12: 위글 리뷰영상 이벤트 심사 승인
 *               * 13: 위글 리뷰영상 이벤트 심사 거절
 *       title:
 *         type: string
 *         example: 위글 리뷰영상 이벤트 심사 승인
 *         description: fcm 알림 제목
 *       message:
 *         type: string
 *         example: 리뷰영상 심사 완료! 바로 사용 가능한 2,000 포인트를 지급하였습니다.
 *         description: fcm 알림 메시지
 *       target_uid:
 *         type: number
 *         example: 1
 *         description: |
 *           타겟 uid, fcm 알림 타입에 따라 타겟 uid 변경
 *           alarm_type: 0일 경우에는 target_uid: 0, 위글 앱 실행
 *           * 위글 앱 서버 실행
 *               * 0: 위글 주문 알림 => 판매자에게 전달. 받는 uid 없음. 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
 *               * 1: 리뷰 영상 등록 알림 => 판매자에게 전달. 받는 uid 없음
 *               * 2: 리워드 지급 알림 => 리뷰어에게 전달. 받는 uid 없음. 리워드 상세 페이지 실행
 *               * 3: 댓글 등록 알림 => 비디오 업로더에게 전달. 댓글 uid
 *               * 4: 대댓글 등록 알림 => 댓글 작성자에게 전달. 대댓글 uid
 *               * 5: 문의 등록 알림 => 판매자에게 전달. 받는 uid 없음. 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
 *               * 6: 위글가입 포인트 알림 => 회원가입자에게 전달. 받는 uid 없음
 *               * 7: 구매 확정 알림 => 판매자에게 전달. 받는 uid 없음. 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
 *
 *           * 판매자사이트 서버 실행
 *               * 8: 배송 시작 알림 => 구매자에게 전달. 주문 uid
 *               * 9: 구매 확정 요청 알림 => 구매자에게 전달. 상품 구매 목록 실행(/api/private/order/list)
 *               * 10: 문의사항 답변 등록 알림 => 구매자에게 전달. 나의 문의하기 목록 실행(/api/private/qna/list/me)
 *               * 11: 선물 기한 알림 => 주문 uid(보낸사람이 취소)
 *
 *           * 관리자사이트 서버 실행
 *               * 12: 위글 리뷰영상 이벤트 심사 승인 => 리뷰어에게 전달. 받는 uid 없음
 *               * 13: 위글 리뷰영상 이벤트 심사 거절 => 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
 *       user_uid:
 *         type: number
 *         example: 1
 *         description: 알림 받은 유저 uid
 *       video_uid:
 *         type: number
 *         example: 30
 *         description: 영상 Uid
 *       icon_filename:
 *         type: string
 *         example: reivew.png
 *         description: |
 *           fcm 알림 아이콘 파일명
 *           fcm 알림 타입에 따라 icon_filename이 저장
 *           * 위글 앱 서버 실행
 *               * 0: 위글 주문 알림 => order.png
 *               * 1: 리뷰 영상 등록 알림 => review.png
 *               * 2: 리워드 지급 알림 => reward.png
 *               * 3: 댓글 등록 알림 => null(db join해서 가져온다.)
 *               * 4: 대댓글 등록 알림 => null(db join해서 가져온다.)
 *               * 5: 문의 등록 알림 => qna.png
 *               * 6: 위글가입 포인트 알림 => point.png
 *               * 7: 구매 확정 알림 => order_success.png
 *
 *           * 판매자사이트 서버 실행
 *               * 8: 배송 시작 알림 => delever.png
 *               * 9: 구매 확정 요청 알림 => order_success.png
 *               * 10: 문의사항 답변 등록 알림 => qna.png
 *               * 11: 선물 기한 알림 => order.png
 *
 *           * 관리자사이트 서버 실행
 *               * 12: 위글 리뷰영상 이벤트 심사 승인 => review.png
 *               * 13: 위글 리뷰영상 이벤트 심사 거절 => review.png
 */
