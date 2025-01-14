/**
 * Created by yunhokim on 2023. 04. 07.
 *
 * @swagger
 * /api/public/v3/category/list:
 *
 *   get:
 *     summary: 상품카테고리목록 v3
 *     tags: [Category]
 *     description: |
 *       ## path : /api/public/v3/category/list
 *       ## file : v3SelectCategoryProductList.js
 *
 *       ## * 상품카테고리목록 v3
 *       ## * 카테고리, 상세 카테고리 반영함
 *
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         default: 65535
 *         schema:
 *           type: number
 *           example: 65535
 *         description: |
 *           비트 연산으로 표현하는 구버전 카테고리 구분방식.
 *           category 테이블에 비트연산값 기록. 프론트 구조 변경이 완료되면 그때 카테고리 uid를 사용한다.
 *           ==> 65535 : 모든 상품
 *           ==> 멀티선택의 경우 코드 값을 합치면됨
 *           ==> ex) 1+8+32 = 41
 *           * 1 : 식품/밀키트
 *           * 2 : 뷰티/주얼리
 *           * 4 : 인테리어
 *           * 8 : 패션/잡화
 *           * 16 : 반려동물
 *           * 32 : 생활용품
 *         enum: [65535,1,2,4,8,16,32]
 *       - in: query
 *         name: category_detail_uid
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           상세 카테고리 테이블 uid
 *           상위 테이블인 카테고리 테이블의 uid값을 상세 카테고리 테이블에서 가지고 있다.
 *       - in: query
 *         name: random_seed
 *         required: true
 *         schema:
 *           type: string
 *           example: 133q1234
 *         description: |
 *           검색할 때 필요한 랜덤 시드입니다.
 *       - in: query
 *         name: delivery_free
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           배송비 무료 여부 필터링입니다.(안쓰는값 고정 0)
 *           * 0: 전체
 *           * 1: 배송비무료
 *         enum: [0,1]
 *       - in: query
 *         name: sort_type
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           각종 정렬 선택 리스트입니다
 *           * 0: 인기순(기본값, 사용)
 *           * 1: 리뷰순(안쓴다)
 *           * 2: 신상품순(최신순, 사용)
 *           * 3: 저가순(사용)
 *           * 4: 고가순(사용)
 *           * 5: 할인율순(안쓴다)
 *         enum: [0,1,2,3,4,5]
 *       - in: query
 *         name: offset
 *         default: 0
 *         required: true
 *         schema:
 *           type: number
 *           example: 0
 *         description: |
 *           페이지 시작 값을 넣어주시면 됩니다. Limit 12
 *           offset 0: 0~11
 *           offset 12: 12~23
 *           offset 24: 24~35
 *     responses:
 *       400:
 *         description: 에러 코드 400
 *         schema:
 *           $ref: '#/definitions/Error'
 */