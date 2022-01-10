/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   OrderProductTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: |
 *           상품 주문 uid
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
 *       order_uid:
 *         type: number
 *         example: 2
 *         description: 구매 UID
 *       product_uid:
 *         type: number
 *         example: 2
 *         description: 상품 UID
 *       seller_uid:
 *         type: number
 *         example: 2
 *         description: 판매자 유저 UID
 *       video_uid:
 *         type: number
 *         example: 2
 *         description: |
 *           리뷰영상 UID
 *           - 리워드 주기 위한 필드
 *           - 0일 경우 리뷰영상을 타고 들어온게 아님
 *       option_ids:
 *         type: string
 *         example: "101,202,303"
 *         description: 옵션 option_id 목록
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
 *         example: "01234567890"
 *         description: 택배사 송장번호
 *       delivery_code:
 *         type: string
 *         example: "08"
 *         description: |
 *           택배사 코드번호
 *           * 스마트택배 api 코드번호 사용
 *           * => http://info.sweettracker.co.kr/apidoc/
 *       is_negligence:
 *         type: int
 *         example: 0
 *         description: |
 *           과실여부
 *           * 0: 고객 과실
 *           * 1: 판매자 과실
 *         enum: [0,1]
 *       cancel_reason:
 *         type: string
 *         example: "취소"
 *         description: |
 *           반품/교환 사유
 *       detail_reason:
 *         type: string
 *         example: "선물 환불"
 *         description: |
 *           반품/교환 상세 사유
 *       requested_time:
 *         type: string
 *         example: 2021-01-01 00:00:00
 *         description: 반품/교환 요청일
 *       accepted_time:
 *         type: string
 *         example: 2021-01-01 00:00:00
 *         description: 반품/교환 승인일
 *       extra_price:
 *         type: int
 *         example: 0
 *         description: 반품 추가 발생 비용 (판매자가 정함)
 *       refund_reward:
 *         type: int
 *         example: 0
 *         description: 리워드 롤백 금액
 *       delivery_status:
 *         type: int
 *         example: 0
 *         description: |
 *           배송비 상태 값
 *           * 0: 일반 배송비
 *           * 1: 도서 산간 배송비
 *           * 2: 무료 배송비
 *       option_total:
 *         type: int
 *         example: 0
 *         description: 옵션 가격 총합
 *       price_delivery:
 *         type: int
 *         example: 4000
 *         description: 배송비
 *       where_position:
 *         type: string
 *         example: "동작대방(대)"
 *         description: 택배 위치
 *       time_trans:
 *         type: string
 *         example: 2021-01-01 00:10:00
 *         description: 택배사 처리 시간
 *       telno_office:
 *         type: string
 *         example: "010-8750-2004"
 *         description: 사업소 기반 전화번호
 *       telno_man:
 *         type: string
 *         example: "010-4247-4681"
 *         description: 배송기사 전화번호
 *       details:
 *         type: string
 *         example: "배달전"
 *         description: 배송 상세 정보
 *       confirmed_time:
 *         type: string
 *         example: 2021-01-01 10:10:00
 *         description: 구매확정일
 *       option_names:
 *         type: string
 *         example: "101상품 / 202상품 / 303상품"
 *         description: 옵션 상품명 목록
 *       product_name:
 *         type: string
 *         example: "주먹감자"
 *         description: 주문상품 이름
 *       product_image:
 *         type: string
 *         example: "aifjwoi02lkawfnewkefwefnwkl3e.png"
 *         description: 주문상품 이미지
 */
