/**
 * Created by hyunhunhwang on 2021. 01. 12.
 *
 * @swagger
 * definitions:
 *   QnA:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: qna uid
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
 *         example: 7
 *         description: qna 작성 유저 uid
 *       product_uid:
 *         type: number
 *         example: 7
 *         description: 상품 uid
 *       is_secret:
 *         type: number
 *         example: 1
 *         description: |
 *           비밀글 여부
 *           * 0: false
 *           * 1: true(비밀글)
 *         enum: [0,1]
 *       is_answer:
 *         type: number
 *         example: 1
 *         description: |
 *           답변 여부
 *           * 0: 미답변
 *           * 1: 답변완료
 *         enum: [0,1]
 *       question:
 *         type: string
 *         example: "질문 제목입니다."
 *         description: 질문 제목
 *       answer:
 *         type: string
 *         example: "답변 내용입니다."
 *         description: 답변 내용
 *       type:
 *         type: number
 *         example: 1
 *         description: |
 *           질문 유형
 *           * 1: 상품
 *           * 2: 배송
 *           * 3: 반품
 *           * 4: 교환
 *           * 5: 환불
 *           * 6: 기타
 *       order_product_uid:
 *         type: number
 *         example: 98
 *         description: 문의한 상품 주문 uid
 */
