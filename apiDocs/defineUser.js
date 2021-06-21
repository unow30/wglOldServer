/**
 * Created by hyunhunhwang on 2021. 01. 05.
 *
 * @swagger
 * definitions:
 *   User:
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
 *         example: kakao
 *         description: |
 *           회원가입 타입
 *           * kakao: 카카오
 *           * naver: 네이버
 *           * apple: 애플
 *         enum: [kakao,naver,apple]
 *       social_id:
 *         type: string
 *         example: kakao-0123456789
 *         description: 소셜에서 제공하는 고유 ID
 *       email:
 *         type: string
 *         example: test@email.com
 *         description: 유저 email
 *       nickname:
 *         type: string
 *         example: kakanick
 *         description: 닉네임
 *       about:
 *         type: string
 *         example: 한줄소개입니다.
 *         description: 한줄소개
 *       gender:
 *         type: string
 *         example: male
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
 *       address:
 *         type: string
 *         example: 주소입니다.
 *         description: 주소
 *       latitude:
 *         type: number
 *         example: 37.5662952
 *         description: 위도
 *       longitude:
 *         type: number
 *         example: 126.9773966
 *         description: 경도
 *       follower_count:
 *         type: number
 *         example: 1234
 *         description: 팔로워 카운트
 *       following_count:
 *         type: number
 *         example: 2
 *         description: 팔로잉 카운트
 *       video_count:
 *         type: number
 *         example: 0
 *         description: 영상 카운트
 *       filename:
 *         type: string
 *         example: abcdefg.jpg
 *         description: 프로필 파일 명
 *       access_token:
 *         type: string
 *         example: abcdefghiabcdefghiabcdefghiabcdefghi
 *         description: 접속 토큰
 *       os:
 *         type: string
 *         example: android
 *         description: 마지막 로그인 / 회원가입한 os
 *       version_app:
 *         type: string
 *         example: 0.0.1
 *         description: 마지막 로그인 / 회원가입한 앱 버전
 */
