/**
 * Created by gunucklee on 2022. 01. 07.
 *
 * @swagger
 * definitions:
 *   Proc_Array_ProductOptionList:
 *     type: object
 *     properties:
 *       idx:
 *         type: number
 *         example: 1
 *         description: 인덱스
 *       list:
 *         type: array
 *         items:
 *           properties:
 *             uid:
 *               type: number
 *               example: 1
 *               description: product option uid
 *             option_id:
 *               type: number
 *               example: 101
 *               description: |
 *                 옵션 id
 *                 ==> 100 단위는 그룹을 의미함
 *                 ==> 10 단위는 옵션 그룹 내에 있는 옵션 목록을 의미함
 *                 ==> 숫자가 작을 수록 먼저 노출
 *             name:
 *               type: string
 *               example: "레드벨벳 칼라 색상 추가"
 *               description: 옵션 상품 명
 *             is_soldout:
 *               type: number
 *               example: 0
 *               description: |
 *                 일시 품절 여부
 *                 * 0: false
 *                 * 1: true (품절)
 *             option_price:
 *               type: number
 *               example: 3000
 *               description: 옵션 가격
 *
 *
 *   ProductOptionListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_ProductOptionList'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/product/${path}"
 *         description: api 경로
 */