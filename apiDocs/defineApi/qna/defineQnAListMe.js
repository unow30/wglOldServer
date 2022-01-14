/**
 * Created by gunucklee on 2022. 01. 13.
 *
 * @swagger
 * definitions:
 *   Proc_Array_QnAListMe:
 *     allOf:
 *       - $ref: '#/definitions/ProductQnaTable'
 *       - type: object
 *         properties:
 *           product_filename:
 *             type: string
 *             example: "52b0d37685420f8ee043b9331b1fca25.png"
 *             description: 상품 이미지
 *           name:
 *             type: string
 *             example: "레드벨벳 케이크"
 *             description: 옵션 상품 명
 *           option_names:
 *             type: string
 *             example: "술고래 술잔세트 4p,벚꽃 술잔세트 4p,술고래 2p + 벚꽃 2p"
 *             description: 옵션 목록 이름
 *
 *
 *   QnAListMeApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Array_QnAListMe'
 *       total_count:
 *         type: number
 *         example: 1
 *         description: 리스트 개수
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/qna/${path}"
 *         description: api 경로
 */



