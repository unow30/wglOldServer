/**
 * Created by hyunhunhwang on 2021. 01. 16.
 *
 * @swagger
 * definitions:
 *   AddressBook:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: 배송지 uid
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
 *         example: 1
 *         description: 배송지 소유자 유저 UID
 *       receive_name:
 *         type: string
 *         example: 홍길동
 *         description: 받는 사람명
 *       phone:
 *         type: string
 *         example: 000-0000-0000
 *         description: 연락처
 *       zipcode:
 *         type: string
 *         example: 00000
 *         description: 우편번호
 *       address:
 *         type: string
 *         example: 서울시 강남구 어디어디
 *         description: 기본 주소
 *       address_detail:
 *         type: string
 *         example: A아파트 00동 00호
 *         description: 상세 주소
 *       is_default:
 *         type: number
 *         example: 0
 *         description: |
 *           기본 배송지 여부
 *           * 0: false (기본 배송지 아님)
 *           * 1: true (기본 배송지)
 *         enum: [0,1]
 *
 */
