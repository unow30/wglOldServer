/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   PointTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: Gift uid
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
 *         description: 유저 uid
 *       order_no:
 *         type: number
 *         example: 1637288387001
 *         description: 주문 no
 *       type:
 *         type: number
 *         example: 1
 *         description: |
 *           포인트 타입
 *           * 1: 지급
 *           * 2: 사용
 *       amount:
 *         type: number
 *         example: 3000
 *         description: |
 *           사용 포인트
 *           * 지급일 경우: +
 *           * 사용일 경우: -
 *       content:
 *         type: string
 *         example: "위글 런칭이벤트 3,000 포인트 적립"
 *         description: 지급 내용
 */
