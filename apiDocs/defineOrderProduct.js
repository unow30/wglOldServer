/**
 * Created by hyunhunhwang on 2021. 02. 18.
 *
 * @swagger
 * definitions:
 *   OrderProduct:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: |
 *           구매 상품 uid
 *           * 상품 uid가 아닙니다.
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
 *         description: 구매자 유저 UID
 *       seller_uid:
 *         type: number
 *         example: 2
 *         description: 판매자 유저 UID
 *       order_uid:
 *         type: number
 *         example: 2
 *         description: 구매 UID
 *       product_uid:
 *         type: number
 *         example: 2
 *         description: 상품 UID
 *       video_uid:
 *         type: number
 *         example: 2
 *         description: 리뷰영상 UID
 *       option_ids:
 *         type: string
 *         example: '101,202,303'
 *         description: 옵션 option_id 목록
 *       option_names:
 *         type: string
 *         example: '101상품 / 202상품 / 303상품'
 *         description: 옵션 상품명 목록
 *       name:
 *         type: string
 *         example: '테스트 상품'
 *         description: 상품명
 *       count:
 *         type: number
 *         example: 2
 *         description: 구매 수량
 *       price_original:
 *         type: number
 *         example: 20000
 *         description: 1개당 상품 원가
 *       payment:
 *         type: number
 *         example: 40000
 *         description: |
 *           총 지불 금액
 *           * price_original X count
 *       filename:
 *         type: string
 *         example: 'abcdefgh.png'
 *         description: 상품 이미지 *
 *       status:
 *         type: number
 *         example: 1
 *         description: |
 *           구매 상태
 *           * 1: 결제 완료
 *           * 2: 상품 준비중
 *           * 3: 배송중
 *           * 4: 배송완료
 *           * 5: 구매확정
 *           * 6: 구매취소
 *           * 10: 반품 신청
 *           * 11: 반품 거절
 *           * 12: 반품 완료
 *           * 20: 교환 신청
 *           * 21: 교환 거절
 *           * 22: 교환 완료
 *         enum: [1,2,3,4,5,6,10,11,12,20,21,22]
 *       delivery_number:
 *         type: string
 *         example: 1234567890
 *         description: 택배사 송장번호
 *       delivery_code:
 *         type: string
 *         example: abcdefg.jpg
 *         description: |
 *           택배사 코드번호
 *           * 스마트택배 api 코드번호 사용
 *           * => http://info.sweettracker.co.kr/apidoc/
 *         enum: [1]
 *       return_reason:
 *         type: string
 *         example: '<사유> 단순 변심 / <상세내용> 디자인이 별로에요 / <수거 방법> 가져가 주세요! / <반품 비용 지불 방법> 환불금에서 차감 / <반품 택배 정보> 택배사: 한진택배, 송장번호:23023 /'
 *         description: |
 *           반품/교환 사유
 *       is_negligence:
 *         type: int
 *         example: 0
 *         description: |
 *           과실여부
 *           * 0: 고객 과실
 *           * 1: 판매자 과실
 *         enum: [0,1]
 */



