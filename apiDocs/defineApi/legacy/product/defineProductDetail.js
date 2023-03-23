/**
 * Created by hyunhunhwang on 2022. 01. 10.
 *
 * @swagger
 * definitions:
 *
 *   Proc_Array_ProductDetail:
 *     allOf:
 *       - $ref: '#/definitions/ProductTable'
 *       - type: object
 *         properties:
 *           nickname:
 *             type: string
 *             example: "kakanick"
 *             description: 닉네임
 *           about:
 *             type: string
 *             example: "한줄소개입니다."
 *             description: 한줄소개
 *           is_seller:
 *             type: number
 *             example: 0
 *             description: |
 *               판매자 여부
 *               * 0: false
 *               * 1: true (판매자)
 *             enum: [0,1]
 *           address:
 *             type: string
 *             example: "주소입니다."
 *             description: 주소
 *           latitude:
 *             type: number
 *             example: 37.5662952
 *             description: 위도
 *           longitude:
 *             type: number
 *             example: 126.9773966
 *             description: 경도
 *           corp_name:
 *             type: string
 *             example: "점빵아저씨"
 *             description: 상호명
 *           corp_reg_num:
 *             type: string
 *             example: "2274200214"
 *             description: 사업자 등록번호
 *           corp_sales_report:
 *             type: string
 *             example: "2019경북경주0216"
 *             description: 통신판매신고업번호
 *           corp_ceo:
 *             type: string
 *             example: "뽀리수제쿠키앤수제청"
 *             description: 사업자명
 *           phone:
 *             type: string
 *             example: "01042474682"
 *             description: 판매자 연락처
 *           user_filename:
 *             type: string
 *             example: "cddaad161993eca3b511f4729ea5cc89.png"
 *             description: 프로필 이미지명
 *           delivery_price:
 *             type: number
 *             example: 3000
 *             description: 배송비
 *           delivery_free:
 *             type: number
 *             example: 10000
 *             description: 배송비 무료 총 상품 가격
 *           delivery_price_plus:
 *             type: number
 *             example: 4000
 *             description: 제주, 도서 지역 추가 비용
 *           delivery_time:
 *             type: string
 *             example: "1~3일"
 *             description: 배송 시간
 *           distance:
 *             type: number
 *             example: 142
 *             description: 유저와의 거리(단위 km)
 *           is_follow:
 *             type: number
 *             example: 0
 *             description: |
 *               팔로우 여부
 *               * 0: 비활성화
 *               * 1: 활성화
 *             enum: [0,1]
 *           is_liked:
 *             type: number
 *             example: 0
 *             description: |
 *               좋아요 여부
 *               * 0: 비활성화
 *               * 1: 활성화
 *             enum: [0,1]
 *           image_count:
 *             type: number
 *             example: 0
 *             description: 상품 이미지 갯수
 *           video_count:
 *             type: number
 *             example: 0
 *             description: 영상 카운트
 *
 *
 *   ProductDetailApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_ProductConfirmList'
 *       image_list:
 *           type: array
 *           items:
 *             $ref: '#/definitions/ImageTable'
 *       image_detail_list:
 *           type: array
 *           items:
 *             $ref: '#/definitions/ImageTable'
 *       video_list:
 *           type: array
 *           items:
 *             allOf:
 *               - $ref: '#/definitions/VideoTable'
 *               - type: object
 *                 properties:
 *                   nickname:
 *                     type: string
 *                     example: "이건욱"
 *                     description: 영상 올린 사람의 이름
 *                   video_filename:
 *                     type: string
 *                     example: "ca590826fbcd192fd987a9b446b98abb.mov"
 *                     description: 영상 파일명
 *                   video_thumbnail:
 *                     type: string
 *                     example: "40e569f52df9ba2f51c695fdb3ce0bbbThumbnail.0000000.jpg"
 *                     description: 영상 썸네일 파일명
 *                   product_image:
 *                     type: string
 *                     example: "cddaad161993eca3b511f4729ea5cc89.png"
 *                     description: 상품 이미지명
 *                   image_filename:
 *                     type: string
 *                     example: "cddaad161993eca3b511f4729ea5cc89.png"
 *                     description: 영상 파일명
 *                   product_name:
 *                     type: string
 *                     example: 상품명입니다
 *                     description: 상품명
 *                   product_discount_price:
 *                     type: number
 *                     example: 4000
 *                     description: 상품 할인 가격
 *                   category:
 *                     type: number
 *                     example: 5
 *                     description: |
 *                       카테고리
 *                       유저 관심사와 동일 (비트연산)
 *                       * 1: 식품
 *                       * 2: 뷰티, 주얼리
 *                       * 4: 인테리어
 *                       * 8: 패션, 잡화
 *                   is_liked:
 *                     type: number
 *                     example: 0
 *                     description: |
 *                       좋아요 여부
 *                       * 0: 비활성화
 *                       * 1: 활성화
 *                     enum: [0,1]
 *                   is_follow:
 *                     type: number
 *                     example: 0
 *                     description: |
 *                       팔로우 여부
 *                       * 0: 비활성화
 *                       * 1: 활성화
 *                     enum: [0,1]
 *       faq_list:
 *           type: array
 *           items:
 *             $ref: '#/definitions/ProductFaqTable'
 *       qna_list:
 *           type: array
 *           items:
 *             allOf:
 *               - $ref: '#/definitions/ProductQnaTable'
 *               - type: object
 *                 properties:
 *                   quest:
 *                     type: string
 *                     example: "비밀글입니다."
 *                     description: 질문
 *                   answer:
 *                     type: string
 *                     example: "비밀글입니다."
 *                     description: 답변
 *                   nickname:
 *                     type: string
 *                     example: "이건욱"
 *                     description: 질문 작성자 이름
 *                   product_filename:
 *                     type: string
 *                     example: "cddaad161993eca3b511f4729ea5cc89.png"
 *                     description: 상품 이미지명
 *                   name:
 *                     type: string
 *                     example: "배부른 떡볶이"
 *                     description: 상품명
 *                   option_names:
 *                     type: string
 *                     example: "술고래 술잔세트 4p,벚꽃 술잔세트 4p,술고래 2p + 벚꽃 2p"
 *                     description: 옵션 목록 이름
 *
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/product/${path}"
 *         description: api 경로
 *
 */
