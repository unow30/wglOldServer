/**
 * Created by gunucklee on 2022. 01. 11.
 *
 * @swagger
 * definitions:
 *   Proc_Single_RewardParam:
 *     type: object
 *     properties:
 *       reward_count:
 *         type: number
 *         example: 9
 *         description: 총 판매 갯수
 *       total_amount:
 *         type: number
 *         example: 114500
 *         description: 누적 리워드
 *       possible_amount:
 *         type: number
 *         example: 80050
 *         description: 환급 가능한 리워드 = 누적 - (신청+사용) + 환불 리워드
 *       refunded_rewards:
 *         type: number
 *         example: 0
 *         description: 누적 리워드
 *       undetermined_amount:
 *         type: number
 *         example: 0
 *         description: 누적 리워드
 *
 *   RewardParamApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_RewardParam'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/reward/${path}"
 *         description: api 경로
 */