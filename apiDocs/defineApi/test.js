/**
 * Created by yunhokim on 2022. 09. 29.
 *
 * @swagger
 * /api/public/test/feed/list:
 *   get:
 *     summary: 피드 목록 업데이트(테섭전용)
 *     tags: [Feed]
 *     description: |
 *       path : /api/public/test/feed/list
 *
 *       * 피드 목록
 *       * 피드 목록은 랜덤으로 주기 때문에 page 개념이 없습니다.
 *       * 피드 목록(전체), 공구목록이 있습니다.
 *       * 만약 위글 광고 클릭후 처음 목록 다음에 피드 목록을 새로 요청할때는 ad_product_uid 는 0으로 보내주세요
 *
 *     parameters:
 *       - in: query
 *         name: select_type
 *         required: true
 *         schema:
 *           type: string
 *           example: all
 *         description: |
 *           all or null: 피드리스트 실행
 *           recent: 최근 2개월 내 등록한 영상 실행
 *           weggledeal: 위글딜 영상 실행
 *         enum: ['', all, recent, weggledeal]
 *       - in: query
 *         name: latitude
 *         default: 37.536977
 *         required: true
 *         schema:
 *           type: number
 *           example: 37.536977
 *         description: 위도 ( ex - 37.500167 )
 *       - in: query
 *         name: longitude
 *         default: 126.955242
 *         required: true
 *         schema:
 *           type: number
 *           example: 126.955242
 *         description: 경도 ( ex - 126.955242 )
 *       - in: query
 *         name: km
 *         default: 1000
 *         required: true
 *         schema:
 *           type: number
 *           example: 1000
 *         description: |
 *           검색 거리(단위 km)
 *           * 전체: 1000
 *           * 내 주변: 1, 3, 5, 10
 *         enum: [1,3,5,10,1000]
 *       - in: query
 *         name: category
 *         required: true
 *         default: 65535
 *         schema:
 *           type: number
 *           example: 65535
 *         description: |
 *           카테고리 (비트 연산)
 *           ==> 65535 : 모든 상품
 *           ==> 멀티선택의 경우 코드 값을 합치면됨
 *           ==> ex) 1+8+32 = 41
 *           * 1 : 식품
 *           * 2 : 뷰티
 *           * 4 : 홈데코
 *           * 8 : 패션잡화
 *           * 16 : 반려동물
 *           * 32 : 유아
 *           * 64 : 스포츠레저
 *           * 128 : 식물
 *       - in: query
 *         name: video_uid
 *         required: true
 *         default: 0
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           영상 uid
 *           * 영상이 없을 경우 0
 *       - in: query
 *         name: random_seed
 *         required: true
 *         schema:
 *           type: string
 *           example: 133q1234
 *         description: |
 *           검색할 때 필요한 랜덤 시드입니다.
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           페이지 시작 값을 넣어주시면 됩니다. Limit 30
 *           offset 0: 0~30
 *           offset 30: 30~60
 *           offset 60: 60~90
 *       - in: query
 *         name: keyword
 *         required: false
 *         schema:
 *           type: string
 *           example:
 *         description: 검색 키워드(상품명 검색)
 *       - in: query
 *         name: tag
 *         required: false
 *         schema:
 *           type: string
 *           example:
 *         description: |
 *           해시태그 (영상 기준)
 *           * "핸드폰" 과 같이 #이 붙은 것만 검색됨
 *       - in: query
 *         name: filter
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           영상 정렬 필터링
 *           * 0 : 전체
 *           * 1 : 최신순(승인날짜순)
 *           * 2 : 인기순(좋아요개수)
 *           * 3 : 추천순(선호태그의 랜덤 => 우선 조회수로)
 *         enum: [0,1,2,3]
 *
 *     responses:
 *       200:
 *         description: 결과 정보
 *         schema:
 *           $ref: '#/definitions/FeedListApi'
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */