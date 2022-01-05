/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   AddressbookTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: Addressbook uid
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
 *         example: 2
 *         description: 유저 uid
 *       type:
 *         type: number
 *         example: 0
 *         description: |
 *           0: 도서산간지역 아님
 *           1: 도서산간 지역
 *           2: 제주도 지역
 *       receive_name:
 *         type: string
 *         example: 이건욱
 *         description: 받는 사람명
 *       phone:
 *         type: string
 *         example: "01042474682"
 *         description: 연락처
 *       zipcode:
 *         type: string
 *         example: "0821"
 *         description: 우편번호
 *       address:
 *         type: string
 *         example: "부산광역시 수영구 망미동 29-1"
 *         description: 배송지 주소
 *       address_detail:
 *         type: string
 *         example: "101동 2401호"
 *         description: 배송지 주소 상세
 *       is_default:
 *         type: number
 *         example: 0
 *         description: |
 *           기본 배송지
 *           * 0: 기본 배송지 아님
 *           * 1: 기본 배송지
 *         enum: [0,1]
 */
