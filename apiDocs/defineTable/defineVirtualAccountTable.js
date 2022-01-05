/**
 * Created by gunucklee on 2022. 01. 05.
 *
 * @swagger
 * definitions:
 *   VirtualAccountTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 5
 *         description: 영상 uid
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
 *       receipt_id:
 *         type: string
 *         example: "61808b960199430020442539"
 *         description: 부트페이에서 발급하는 고유 영수증 ID
 *       order_id:
 *         type: string
 *         example: "010293372051635814294052"
 *         description: 부트페이로부터 결제 요청 시 보냈던 주문번호
 *       name:
 *         type: string
 *         example: "배부른 떡볶이"
 *         description: 판매된 대표 상품명
 *       price:
 *         type: number
 *         example: 31300
 *         description: 결제된 금액
 *       unit:
 *         type: string
 *         example: "krw"
 *         description: |
 *           판매된 결제 단위
 *           * krw: 원
 *           * usd: 달러
 *       pg:
 *         type: string
 *         example: "inicis"
 *         description: |
 *           결제된 PG의 Alias
 *           * danal
 *           * inicis
 *           * kcp
 *       method:
 *         type: string
 *         example: "card"
 *         description: |
 *           결제된 수단 Alias
 *           * card
 *           * vbank
 *           * bank
 *           * phone
 *       pg_name:
 *         type: string
 *         example: "이니시스"
 *         description: 결제된 PG사의 명칭
 *       method_name:
 *         type: string
 *         example: "카카오페이"
 *         description: 결제된 수단의 명칭
 *       deal_endtime:
 *         type: string
 *         example: 2021-11-02 09:52:11
 *         description: 위글 딜 종료 날짜
 *       payment_data:
 *         type: string
 *         example: "ca590826fbcd192fd987a9b446b98abb.mov"
 *         description: |
 *           PG 사에서 보내온 결제 raw 데이터
 *           * bankname: 입금할 은행명
 *           * accountolder: 예금주
 *           * account: 입금할 계좌번호
 *           * expiredate: 입금 만료 시간
 *           * username: 입금자명 (일부 PG는 전달이 안됨)
 *           * cash_result: 현금영수증 번호
 *       requested_at:
 *         type: string
 *         example: "2021-11-02 14:24:22"
 *         description: 결제가 처음 요청된 시각 ( 한국 기준시 +09:00 )
 *       purchased_at:
 *         type: string
 *         example: "2021-11-02 14:24:22"
 *         description: 결제 승인이 된 시각 ( 한국 기준시 +09:00 )
 *       status:
 *         type: number
 *         example: "영상 내용 입니다."
 *         description: |
 *           결제 상태 ( 현재 결제의 상태를 나타냅니다. 결제 검증에서 가장 중요한 지표가 됩니다. )
 *           * 0: 결제 대기 상태입니다. 승인이 나기 전의 상태입니다.
 *           * 1: 결제 완료된 상태입니다.
 *           * 2: 결제 승인 전 상태입니다. transactionConfirm() 함수를 호출하셔서 결제를 승인합니다.
 *           * 3: 결제 승인 중 상태입니다. PG 사에서 transaction 처리 중입니다.
 *           * 20: 결제가 취소된 상태입니다.
 *           * -20: 결제취소가 실패한 상태입니다.
 *           * -30: 결제취소가 진행 중인 상태입니다.
 *           * -1: 오류로 인해 결제가 실패한 상태입니다.
 *           * -2: 결제 승인이 실패하였습니다.
 */
