/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   ProductOptionTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: product option uid
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
 *       product_uid:
 *         type: number
 *         example: 3
 *         description: 상품 uid
 *       option_id:
 *         type: number
 *         example: 101
 *         description: |
 *           옵션 id
 *           ==> 100 단위는 그룹을 의미함
 *           ==> 10 단위는 옵션 그룹 내에 있는 옵션 목록을 의미함
 *           ==> 숫자가 작을 수록 먼저 노출
 *       name:
 *         type: string
 *         example: "레드벨벳 칼라 색상 추가"
 *         description: 옵션 상품 명
 *       is_soldout:
 *         type: number
 *         example: 0
 *         description: |
 *           일시 품절 여부
 *           * 0: false
 *           * 1: true (품절)
 *       option_price:
 *         type: number
 *         example: 3000
 *         description: 옵션 가격
 *       option_is_changed:
 *         type: number
 *         example: 0
 *         description: |
 *           관리자 옵션 변경 확인
 *           * 0: 변경 없음
 *           * 1: 옵션 변경 됨 or 옵션 추가 됨
 */
