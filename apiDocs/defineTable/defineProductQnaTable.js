/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   ProductQnaTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: product qna uid
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
 *         example: 3
 *         description: 문의한 유저 uid
 *       product_uid:
 *         type: number
 *         example: 24
 *         description: 문의한 상품 uid
 *       is_secret:
 *         type: number
 *         example: 0
 *         description: |
 *           비밀글 여부
 *           * 0: 비밀글 아님
 *           * 1: 비밀글
 *       is_answer:
 *         type: number
 *         example: 0
 *         description: |
 *           답변 완료 여부
 *           * 0: 미답변
 *           * 1: 답변 완료
 *       question:
 *         type: string
 *         example: "10개를 주문하면 배송주소가 다달라도 5안뭔 이상이니 배송비는 무료인지요?"
 *         description: 질문 - 질문 카테고리 선택으로 정해져 있음
 *       answer:
 *         type: string
 *         example: "안녕하세요? 한군데로 상품이 5만원 이상일 시 배송비가 무료입니다. ^^ 감사합니다."
 *         description: 답변 - 판매자가 작성
 *       type:
 *         type: number
 *         example: 2
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
 *         example: 10
 *         description: 문의한 상품 주문 uid
 */
