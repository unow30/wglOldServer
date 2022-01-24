/**
 * Created by yunhokim on 2022. 01. 21.
 *
 * @swagger
 * definitions:
 *   Proc_Single_User_Alert:
 *     type: object
 *     properties:
 *       is_alert_review_video:
 *         type: number
 *         example: 0
 *         description: |
 *           리뷰 영상 등록 알림 on/off
 *           * 0: on
 *           * 1: off
 *         enum: [0,1]
 *       is_alert_order_confirm:
 *         type: number
 *         example: 0
 *         description: |
 *           상품 구매 확정 알림 on/off
 *           * 0: on
 *           * 1: off
 *         enum: [0,1]
 *       is_alert_comment:
 *         type: number
 *         example: 0
 *         description: |
 *           댓글 등록 알림 on/off
 *           * 0: on
 *           * 1: off
 *         enum: [0,1]
 *       is_alert_nested_comment:
 *         type: number
 *         example: 0
 *         description: |
 *           대댓글 등록 알림 on/off
 *           * 0: on
 *           * 1: off
 *         enum: [0,1]
 *       is_alert_order_confirm_request:
 *         type: number
 *         example: 0
 *         description: |
 *           구매 확정 요청 알림 on/off
 *           * 0: on
 *           * 1: off
 *         enum: [0,1]
 *       is_alert_product_qna:
 *         type: number
 *         example: 0
 *         description: |
 *           문의 등록 알림 on/off
 *           * 0: on
 *           * 1: off
 *         enum: [0,1]
 *       is_seller:
 *         type: number
 *         example: 0
 *         description: |
 *           판매자 여부 확인
 *           * 0: user
 *           * 1: seller
 *         enum: [0,1]
 *
 *   UserAlertApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_User_Alert'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/alert/${path}"
 *         description: api 경로
 */
