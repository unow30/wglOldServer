/**
 * Created by gunucklee on 2022. 01. 11.
 *
 * @swagger
 * definitions:
 *   Proc_Single_RewardBankInfo:
 *     allOf:
 *       - $ref: '#/definitions/AccountBookTable'
 *       - type: object
 *         properties:
 *           id_filename:
 *             type: string
 *             example: "ca590826fbcd192fd987a9b446b98abb.jpg"
 *             description: 신분증 파일명
 *           bankbook_filename:
 *             type: string
 *             example: "fg590826fbcd192fd987a9b446b98abb.jpg"
 *             description: 통장 사본 파일명
 *
 *   RewardBankInfoApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_RewardBankInfo'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/reward/${path}"
 *         description: api 경로
 */