/**
 * Created by hyunhunhwang on 2020. 12. 21.
 */
const express = require('express');
const app = express();

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const osUtil = require('../common/utils/legacy/origin/osUtil');
const funcUtil = require('../common/utils/legacy/origin/funcUtil');

let private_ip = osUtil.getIpAddress();

let description_text = `
## IP 체크 : ${private_ip} ===>> ${funcUtil.getServerType()}
## 서버 정보
    * 테스트 서버 정보
        * url : ${process.env.DEV_PUBLIC_IP}
        * port : ${process.env.PORT}
    * ex) http://${process.env.DEV_PUBLIC_IP}:${process.env.PORT}/api-docs/
    * 운영 서버 정보
        * dns : 미정
        * url : ${process.env.REAL_PUBLIC_IP}
        * port : ${process.env.PORT}
    * ex) http://${process.env.REAL_PUBLIC_IP}:${process.env.PORT}/api-docs/
## path 정보
    * /api/public/* : 로그인 하지 않은 상태에서 접근 가능
    * /api/private/* : 로그인 하지 않은 상태에서 접근 불가능
        * header에 access_token값 필수
## Header 정보
    * access_token
        * 접속 토큰
        * 회원가입/회원가입 여부 체크시 발급
## 파일(이미지, 영상) 
    * 테스트 서버 파일 경로 
        * default url: ${process.env.DEV_FILE_PATH}
        * db filed: [abcd.png]
        * 샘플) ${process.env.DEV_FILE_PATH}abcd.png
    * 운영 서버 파일 경로 
        * default url: ${process.env.REAL_FILE_PATH}
        * 샘플) ${process.env.REAL_FILE_PATH}abcd.png
    * 테스트 서버 MEDIA CONVERT 파일 경로 (워터마크 영상, 썸네일 이미지)
        * default url: ${process.env.DEV_CONVERT_FILE_PATH}
        * db filed: [abcd.png]
        * 샘플) ${process.env.DEV_CONVERT_FILE_PATH}abcd.png
    * 운영 서버 MEDIA CONVERT 파일 경로 (워터마크 영상, 썸네일 이미지)
        * default url: ${process.env.REAL_CONVERT_FILE_PATH}
        * 샘플) ${process.env.REAL_CONVERT_FILE_PATH}abcd.png
## 이용 약관
    * 서비스 이용약관 => http://weggle.kr/terms/service.html
    * 개인정보처리방침 => http://weggle.kr/terms/privacy.html
## 응답 메세지
    * 응답 형식 : json
    * HTTP Status Code
        * 200: 성공
        * 400: 실패
    * 에러코드 (HTTP Status Code - 400)
        * 200: 서버 시스템 및 db 에러 발생
        * 201: 존재하지 않는 API 경로
        * 400: 에러
        * 401: 파라미터 에러
        * 402: 파라미터 에러( 헤더 )
        * 403: 데이터 없음
        * 404: 인증 오류
        * 405: 이미 존재함
        * 406: 이미 존재함 - 이메일
        * 407: 이미 존재함 - 연락처
        * 408: 탈퇴
        * 409: 존재하지 않음 - 이메일
        * 410: 존재하지 않음 - 연락처
        * 411: 보내기 실패
        * 412: 시간 오류
    * 에러샘플 ( type - json ):
        {
            method: "GET",
            url: "/api/user",
            code : 201,
            message : "존재하지 않는 API 경로 입니다."
        }
## 테스트 유저 정보
    * access_token : abcd1234abcd1234
`;

let swaggerDefinition = {
    info: {
        version: '20210121.1',
        host: osUtil.getIpAddress(),
        // host: '13.209.247.11',   // 본 서버

        basePath: '/',

        title: '위글 API 문서',
        description: description_text,
        contact: {
            name: 'API Support',
            email: 'kinosoul@gmail.com',
        },
    },

    securityDefinitions: {
        // user_uid: {
        //     "type": "apiKey",
        //     "name": "user_uid",
        //     "in": "header"
        // },
        access_token: {
            "type": "apiKey",
            "name": "access_token",
            "in": "header"
        },
    },
    security: [
        {
            // user_uid: [],
            access_token: [],
        }
    ],
    schemes: [
        "http", "https"
    ],
    tags: [
        {
            name: 'Auth',
            description: '퍼블릭 엑세스 토큰 생성'
        },
        {
            name: 'Dev',
            description: '개발 테스트용 API'
        },
        {
            name: 'User',
            description: '유저 관련 API'
        },
        {
            name: 'Category',
            description: '카테고리 아이콘, 카테고리 리스트 API'
        },
        {
            name: 'Feed',
            description: '피드 관련 API'
        },
        {
            name: 'WeggleDeal',
            description: '위글딜 관련 API'
        },
        {
            name: 'Product',
            description: '상품 관련 API'
        },
        {
            name: 'Order',
            description: '구매 관련 API'
        },
        {
            name: 'Cart',
            description: '장바구니 관련 API'
        },
        {
            name: 'Comment',
            description: '댓글 관련 API'
        },
        {
            name: 'Video',
            description: '영상 및 리뷰 관련 API'
        },
        {
            name: 'Follow',
            description: '팔로우 관련 API'
        },
        {
            name: 'AddressBook',
            description: '배송지 관련 API'
        },
        {
            name: 'Reward',
            description: '리워드 관련 API'
        },
        {
            name: 'Point',
            description: '포인트 관련 API'
        },
        {
            name: 'Like',
            description: '좋아요,찜하기 관련 API'
        },
        {
            name: 'QnA',
            description: '문의하기 관련 API'
        },
        {
            name: 'Report',
            description: '신고하기 관련 API'
        },
        {
            name: 'SearchView',
            description: '검색화면 관련 API'
        },
        {
            name: 'Gift',
            description: '선물 관련 API'
        },
        {
            name: 'File',
            description: '파일(이미지, 영상) 관련 API'
        },
        {
            name: 'Review',
            description: '포토 리뷰 관련 API'
        },
        {
            name: 'GroupBuying',
            description: '공동구매 관련 API'
        },
        {
            name: 'Weggler',
            description: '위글러 관련 API'
        },
        {
            name: 'Challenge',
            description: '챌린지 관련 API'
        },
    ],
};
// options for swagger jsdoc
let options = {
    swaggerDefinition: swaggerDefinition, // swagger definition
    apis: [
        './routes/**/*.js',
        './apiDocs/**/*.js',
    ], // path where API specification are written
};
// initialize swaggerJSDoc
let swaggerSpec = swaggerJSDoc(options);

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
