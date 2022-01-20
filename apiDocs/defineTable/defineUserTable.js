/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   UserTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: 유저 uid
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
 *       signup_type:
 *         type: string
 *         example: "kakao"
 *         description: |
 *           회원가입 타입
 *           * kakao: 카카오
 *           * naver: 네이버
 *           * apple: 애플
 *         enum: [kakao,naver,apple]
 *       social_id:
 *         type: string
 *         example: "kakao-0123456789"
 *         description: 소셜에서 제공하는 고유 ID
 *       email:
 *         type: string
 *         example: "test@email.com"
 *         description: 유저 email
 *       nickname:
 *         type: string
 *         example: "kakanick"
 *         description: 닉네임
 *       about:
 *         type: string
 *         example: "한줄소개입니다."
 *         description: 한줄소개
 *       gender:
 *         type: string
 *         example: "male"
 *         description: |
 *           성별
 *           * male: 남성
 *           * female: 여성
 *         enum: [male,female]
 *       interests:
 *         type: number
 *         example: 69
 *         description: |
 *           관심사(카테고리) - 비트연산
 *           ex) (1:식품)+(4:홈데코)+(64:스포츠레저) = 69
 *           * 1: 식품
 *           * 2: 뷰티
 *           * 4: 홈데코
 *           * 8: 패션잡화
 *           * 16: 반려동물
 *           * 32: 유아
 *           * 64: 스포츠레저
 *           * 128: 식물
 *       age:
 *         type: number
 *         example: 30
 *         description: |
 *           나이대역
 *           * 20: 20대 이하
 *           * 30: 30대
 *           * 40: 40대
 *           * 50: 50대 이상
 *         enum: [20,30,40,50]
 *       is_seller:
 *         type: number
 *         example: 0
 *         description: |
 *           판매자 여부
 *           * 0: false
 *           * 1: true (판매자)
 *         enum: [0,1]
 *       seller_time:
 *         type: string
 *         example: 2021-01-01 00:00:00
 *         description: 판매자 전환 시간
 *       phone:
 *         type: string
 *         example: "01042474682"
 *         description: 판매자 연락처
 *       address:
 *         type: string
 *         example: "주소입니다."
 *         description: 주소
 *       latitude:
 *         type: number
 *         example: 37.5662952
 *         description: 위도
 *       longitude:
 *         type: number
 *         example: 126.9773966
 *         description: 경도
 *       access_token:
 *         type: string
 *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjQsImlhdCI6MTY0MDAwMTczMCwiZXhwIjoxNjQ4NjQxNzMwfQ.n45qKHAurVtSiI8Wtw-3_ipLIkXk3Ii_bQdIHH4_2mQ"
 *         description: 접속 토큰
 *       push_token:
 *         type: string
 *         example: "c3gYYhCwBU6sp77jhXKwMk:APA91bGOuSCb3JQUFBYGeq2szyo_wY2EymrPBn8oA33MdTCLbLgNEKsb5veY2U7ElsFga14y3hgZHSlt9l4cr6vv3bZsm2n3p8n4R93QTkNAOdLNHmKiAgCdgrqRAmM6CyslxDO9zaaA"
 *         description: 푸시 토큰
 *       os:
 *         type: string
 *         example: "ANDROID"
 *         description: 디바이스 운영체제
 *       version_app:
 *         type: string
 *         example: "1.3.11"
 *         description: 앱 버전
 *       corp_name:
 *         type: string
 *         example: "점빵아저씨"
 *         description: 상호명
 *       corp_reg_num:
 *         type: string
 *         example: "2274200214"
 *         description: 사업자 등록번호
 *       corp_sales_report:
 *         type: string
 *         example: "2019경북경주0216"
 *         description: 통신판매신고업번호
 *       zipcode:
 *         type: string
 *         example: "48043"
 *         description: 우편번호
 *       address_detail:
 *         type: string
 *         example: "1층 오스트리치팩토리"
 *         description: 배송지 주소 상세
 *       delivery_price:
 *         type: number
 *         example: 3000
 *         description: 배송비
 *       delivery_free:
 *         type: number
 *         example: 10000
 *         description: 배송비 무료 총 상품 가격
 *       delivery_price_plus:
 *         type: number
 *         example: 4000
 *         description: 제주, 도서 지역 추가 비용
 *       delivery_time:
 *         type: string
 *         example: "1~3일"
 *         description: 배송 시간
 *       corp_ceo:
 *         type: string
 *         example: "뽀리수제쿠키앤수제청"
 *         description: 사업자명
 *       seller_account_code:
 *         type: string
 *         example: "02"
 *         description: |
 *           이니시스 은행코드
 *
 *           02 : 한국산업은행
 *           03 : 기업은행
 *           04 : 국민은행
 *           05 : 외환은행
 *           06 : 국민은행
 *           07 : 수협중앙회
 *           11 : 농협중앙회
 *           12 : 단위농협
 *           16 : 축협중앙회
 *           20 : 우리은행
 *           23 : sc제일은행
 *           31 : 대구은행
 *           32 : 부산은행
 *           34 : 광주은행
 *           35 : 제주은행
 *           37 : 전북은행
 *           38 : 강원은행
 *           39 : 경남은행
 *           41 : 비씨카드
 *           45 : 새마을금고
 *           48 : 신용협동조합중앙회
 *           50 : 상호저축은행
 *           53 : 씨티은행
 *           54 : 홍콩상하이은행
 *           55 : 도이치은행
 *           56 : ABN 암로
 *           70 : 신안상호저축은행
 *           71 : 우체국
 *           81 : 하나은행
 *           87 : 신세계
 *           88 : 신한은행
 *       seller_account_num:
 *         type: string
 *         example: "3120190243442"
 *         description: 판매자 계좌번호
 *       seller_account_file_name:
 *         type: string
 *         example: "5e3784d7f12470309a33bcfd7385c6d7.jpg"
 *         description: 판매자 통장사본명
 *       seller_account_name:
 *         type: string
 *         example: "김혜용(칼플로티나)"
 *         description: 예금주명
 *       recommender_code:
 *         type: string
 *         example: "RDCNJK"
 *         description: 추천인 코드
 *       recommendee_code:
 *         type: string
 *         example: "VQMIL4"
 *         description: 피추천인 코드
 *       is_alert_review_video:
 *         type: number
 *         example: 0
 *         description: |
 *           리뷰 영상 등록 알림
 *           * 0: false
 *           * 1: true (판매자)
 *         enum: [0,1]
 *       is_alert_order_confirm:
 *         type: number
 *         example: 0
 *         description: |
 *           상품 구매 확정 알림
 *           * 0: false
 *           * 1: true (판매자)
 *         enum: [0,1]
 *       is_alert_comment:
 *         type: number
 *         example: 0
 *         description: |
 *           댓글 등록 알림
 *           * 0: false
 *           * 1: true (판매자)
 *         enum: [0,1]
 *       is_alert_nested_comment:
 *         type: number
 *         example: 0
 *         description: |
 *           대댓글 등록 알림
 *           * 0: false
 *           * 1: true (판매자)
 *         enum: [0,1]
 *       is_alert_order_confirm_request:
 *         type: number
 *         example: 0
 *         description: |
 *           구매 확정 요청 알림
 *           * 0: false
 *           * 1: true (판매자)
 *         enum: [0,1]
 *       is_alert_product_qna:
 *         type: number
 *         example: 0
 *         description: |
 *           문의 등록 알림
 *           * 0: false
 *           * 1: true (판매자)
 *         enum: [0,1]
 */
