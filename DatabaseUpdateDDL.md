#2021-06-11 (FRI) changed by gun uck LEE
ALTER TABLE tbl_video add COLUMN is_authorize int default 0 comment '승인 여부 (판매자 동영상만 적용)
0: 대기중
1: 승인';


ALTER TABLE tbl_ad add COLUMN is_authorize int default 0 comment '승인 여부
0: 대기중
1: 승인';

#2021-06-16 (WEN) changed by gun uck LEE
ALTER TABLE tbl_video add COLUMN authorize_time timestamp comment '승인 된 시간'

#2021-06-17 (THU) changed by gun uck LEE
ALTER table tbl_product_option add COLUMN option_price int default 0 comment '옵션 가격'


#2021-06-18 (FRI) changed by gun uck LEE
ALTER TABLE tbl_user add COLUMN delivery_price int default 0 comment '배송비'
ALTER TABLE tbl_user add COLUMN delivery_free int default 0 comment '배송비 무료 총 상품 가격'
ALTER TABLE tbl_user add COLUMN delivery_price_plus int default 0 comment '제주, 도서 지역 추가 비용'

ALTER TABLE tbl_product Drop COLUMN delivery_price
ALTER TABLE tbl_product Drop COLUMN delivery_free
ALTER TABLE tbl_product Drop COLUMN delivery_price_plus



#2021-06-21 (MON) changed by gun uck LEE
ALTER TABLE tbl_user MODIFY COLUMN interests int default 0 comment '카테고리
유저 관심사와 동일 (비트연산)

[현재 관심사]
1: 식품
2: 뷰티
4: 홈데코
8: 패션잡화
16: 반려동물
32: 유아
64: 스포츠레저
128: 식물


[옛날 관심사]
1: 수제 먹거리
2: 음료
4: 인테리어 소품
8: 악세사리
16: 휴대폰 주변기기
32: 비누/캔들
64: 가죽 공예
128: 꽃
256: 반려견';


ALTER TABLE tbl_product MODIFY COLUMN category int default 0 comment '카테고리
유저 관심사와 동일 (비트연산)

[현재 카테고리]
1: 식품
2: 뷰티
4: 홈데코
8: 패션잡화
16: 반려동물
32: 유아
64: 스포츠레저
128: 식물


[옛날 카테고리]
1: 수제 먹거리
2: 음료
4: 인테리어 소품
8: 악세사리
16: 휴대폰 주변기기
32: 비누/캔들
64: 가죽 공예
128: 꽃
256: 반려견';


ALTER TABLE tbl_product add COLUMN detail_info text comment '상품 상세 설명';


ALTER TABLE tbl_user add COLUMN corp_name varchar(45) comment '상호명';


ALTER TABLE tbl_user add COLUMN corp_reg_num varchar(45) comment '사업자 등록번호';


ALTER TABLE tbl_user add COLUMN corp_sales_report varchar(45) comment '통신판매신고업번호';



#2021-06-23 (WEN) changed by gun uck LEE

ALTER TABLE tbl_order_product add COLUMN status int default 0 comment '구매 상태
1: 결제 완료
2: 상품 준비중
3: 배송중
4: 배송완료
5: 구매확정
6: 구매취소
7: 교환/환불'; 








#2021-06-25 (FRI) changed by gun uck LEE

ALTER TABLE tbl_order Drop COLUMN status;

ALTER TABLE tbl_order Drop COLUMN delivery_number;

ALTER TABLE tbl_order Drop COLUMN delivery_code;








ALTER TABLE tbl_order_product add COLUMN status int default 1 comment '구매 상태
1: 결제 완료
2: 상품 준비중
3: 배송중
4: 배송완료
5: 구매확정
6: 구매취소

10: 반품 신청
11: 반품 거절
12: 반품 완료

20: 교환 신청
21: 교환 거절
22: 교환 완료

';



ALTER TABLE tbl_order_product add COLUMN delivery_number tinytext comment '택백사 송장번호';

ALTER TABLE tbl_order_product add COLUMN delivery_code int default 0 comment '택배사 코드번호';



ALTER TABLE tbl_order_product add COLUMN return_reason text comment '반품/교환 사유';

ALTER TABLE tbl_order_product add COLUMN is_negligence int default 1 comment '과실 여부
0: 고객 과실
1: 판매자 과실';


# 2021-06-28 (MON) tbl_product 칼럼 추가
ALTER TABLE tbl_product add COLUMN deal_starttime timestamp comment '위글 딜 시작날짜'
ALTER TABLE tbl_product add COLUMN deal_price_discount int default 0 comment '위글 딜 할인가'
ALTER TABLE tbl_product add COLUMN deal_discount_rate int default 0 comment '위글 딜 할인율'




#2021-07-01 (THU) changed by gun uck LEE
ALTER TABLE tbl_order_product MODIFY COLUMN is_negligence int comment '과실 여부
0: 고객 과실
1: 판매자 과실'


#2021-07-05 (MON) changed by gun uck LEE
ALTER TABLE tbl_product_qna add COLUMN order_product_uid int default 0 comment '문의한 상품 주문 uid';

ALTER TABLE tbl_order_product drop return_reason;

ALTER TABLE tbl_order_product add COLUMN cancel_reason varchar(45) comment '반품/교환 사유';
ALTER TABLE tbl_order_product add COLUMN detail_reason text comment '반품/교환 상세 사유';
ALTER TABLE tbl_order_product add COLUMN requested_time timestamp comment '반품/교환 요청일';
ALTER TABLE tbl_order_product add COLUMN accepted_time timestamp comment '반품/교환 승인일';


#2021-07-06 (TUE) changed by gun uck LEE
ALTER TABLE tbl_order add COLUMN cancelable_price int default 0 comment '교환/환불 가능 금액';



#2021-07-07 (WEN) changed by gun uck LEE

ALTER TABLE tbl_user add COLUMN zipcode tinytext comment '우편번호';
ALTER TABLE tbl_user add COLUMN address_detail tinytext comment '배송지 주소 상세';

ALTER TABLE tbl_user add COLUMN bank_user varchar(45) comment '환불 받을 예금주명';
ALTER TABLE tbl_user add COLUMN bank_code tinytext comment '환불 신청 은행코드
002 : 산업은행
003 : 기업은행
004 : 국민은행
007 : 수협은행
011 : 농협은행
020 : 우리은행
023 : SC제일은행
027 : 한국씨티은행
031 : 대구은행
032 : 부산은행
034 : 광주은행
035 : 제주은행
037 : 전북은행
039 : 경남은행
045 : 새마을금고
048 : 신협중앙회
050 : 저축은행
054 : HSBC은행
055 : 도이치은행
057 : JP모간체이스은행
060 : 뱅크오브아메리카
061 : BNP파리바은행
062 : 중국공상은행
063 : 중국은행
064 : 산림조합중앙회
067 : 중국건설은행
071 : 우체국
081 : 하나은행
088 : 신한은행
089 : 케이뱅크
090 : 카카오뱅크

209 : 유안타증권
218 : KB증권
224 : BNK투자증권
225 : IBK투자증권
227 : KTB투자증권
238 : 미래에셋대우
240 : 삼성증권
243 : 한국투자증권
247 : NH투자증권
261 : 교보증권
262 : 하이투자증권
263 : 현대차증권
264 : 키움증권
265 : 이베스트투자증권
266 : 에스케이증권
267 : 대신증권
269 : 한화투자증권
270 : 하나금융투자
278 : 신한금융투자
279 : DB금융투자
280 : 유진투자증권
287 : 메리츠증권
288 : 카카오페이증권
290 : 부국증권
291 : 신영증권
292 : 케이프투자증권
294 : 한국포스증권';

ALTER TABLE tbl_user add COLUMN bank_account varchar(45) comment '환불 받을 은행 계좌번호';


#2021-07-12 (MON) changed by gun uck LEE
alter table tbl_product add column cancel_info text null comment '반품 및 교환정보';

alter table tbl_product modify column is_deal int default 0 null comment '위글 딜 진행 여부
0: 위글딜 아님
1: 위글딜 진행중
2: 위글딜 심사중';

ALTER TABLE tbl_user add COLUMN delivery_method tinytext comment '배송 방법';
ALTER TABLE tbl_user add COLUMN delivery_time tinytext comment '배송 시간';



#2021-07-13 (TUE) changed by gun uck LEE
alter table tbl_order_product add column extra_price int default 0 null comment '반품 추가 발생 비용 (판매자가 정함)'




#2021-07-14 (WEN) changed by gun uck LEE
ALTER TABLE tbl_report change user_uid  source_uid int;
ALTER TABLE tbl_report change video_uid target_uid int;



ALTER TABLE tbl_report MODIFY COLUMN source_uid int default 0 comment '신고하는 유저 uid';
ALTER TABLE tbl_report MODIFY COLUMN target_uid int default 0 comment '신고 당하는 uid';


alter table tbl_report add column type int default 0 null comment '신고 타입
1: 유저 신고
2: 영상 신고
3: 댓글 신고';

ALTER TABLE tbl_report MODIFY COLUMN choice_value int default 0 comment '신고 선택 객관식 - 비트연산
1: 나체 이미지 또는 성적 행위
2: 혐오 발언 또는 상징
4: 불법 또는 규제 상품 판매
8: 거짓 정보 및 지적 재산권 침해
16: 기타';


#2021-07-14 (WEN) changed by gun uck LEE
alter table tbl_like add column video_uid int default 0 null comment '상품 찜하기 시 리워드를 전달할 video uid'



#2021-07-17 (SAT) changed by gun uck LEE
alter table tbl_order_product add column refund_reward int default 0 null comment '리워드 롤백 금액'






