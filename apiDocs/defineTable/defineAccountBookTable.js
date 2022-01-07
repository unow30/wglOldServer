/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   AccountBookTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: Account Book uid
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
 *       bank_user:
 *         type: string
 *         example: "도진현"
 *         description: 예금주명
 *       bank_account:
 *         type: string
 *         example: "123-4567-873595"
 *         description: 은행 계좌번호
 *       bank_code:
 *         type: string
 *         example: "002"
 *         description: |
 *           은행코드
 *           * 002 : 산업은행
 *           * 003 : 기업은행
 *           * 004 : 국민은행
 *           * 007 : 수협은행
 *           * 011 : 농협은행
 *           * 020 : 우리은행
 *           * 023 : SC제일은행
 *           * 027 : 한국씨티은행
 *           * 031 : 대구은행
 *           * 032 : 부산은행
 *           * 034 : 광주은행
 *           * 035 : 제주은행
 *           * 037 : 전북은행
 *           * 039 : 경남은행
 *           * 045 : 새마을금고
 *           * 048 : 신협중앙회
 *           * 050 : 저축은행
 *           * 054 : HSBC은행
 *           * 055 : 도이치은행
 *           * 057 : JP모간체이스은행
 *           * 060 : 뱅크오브아메리카
 *           * 061 : BNP파리바은행
 *           * 062 : 중국공상은행
 *           * 063 : 중국은행
 *           * 064 : 산림조합중앙회
 *           * 067 : 중국건설은행
 *           * 071 : 우체국
 *           * 081 : 하나은행
 *           * 088 : 신한은행
 *           * 089 : 케이뱅크
 *           * 090 : 카카오뱅크
 *           * 209 : 유안타증권
 *           * 218 : KB증권
 *           * 224 : BNK투자증권
 *           * 225 : IBK투자증권
 *           * 227 : KTB투자증권
 *           * 238 : 미래에셋대우
 *           * 240 : 삼성증권
 *           * 243 : 한국투자증권
 *           * 247 : NH투자증권
 *           * 261 : 교보증권
 *           * 262 : 하이투자증권
 *           * 263 : 현대차증권
 *           * 264 : 키움증권
 *           * 265 : 이베스트투자증권
 *           * 266 : 에스케이증권
 *           * 267 : 대신증권
 *           * 269 : 한화투자증권
 *           * 270 : 하나금융투자
 *           * 278 : 신한금융투자
 *           * 279 : DB금융투자
 *           * 280 : 유진투자증권
 *           * 287 : 메리츠증권
 *           * 288 : 카카오페이증권
 *           * 290 : 부국증권
 *           * 291 : 신영증권
 *           * 292 : 케이프투자증권
 *           * 294 : 한국포스증권
 *       is_authorize:
 *         type: number
 *         example: 0
 *         description: |
 *           승인 여부
 *           * 0: 대기중
 *           * 1: 승인
 *         enum: [0,1]
 */
