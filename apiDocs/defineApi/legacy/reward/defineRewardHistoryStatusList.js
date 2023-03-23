/**
 * Created by gunucklee on 2022. 01. 12.
 *
 * @swagger
 * definitions:
 *   Proc_Array_RewardHistoryStatusList:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 9
 *         description: reward uid
 *       created_time:
 *         type: string
 *         example: 2021-01-01 00:00:00
 *         description: 최초 생성 날짜
 *       state:
 *         type: number
 *         example: 12
 *         description: |
 *           리워드 상태
 *           * 1: 리워드 적립
 *           * 2: 리워드 상품 구매에 사용
 *           * 11: 리워드 환급 신청
 *           * 12: 리워드 환급 완료
 *           * 13: 리워드 환불
 *       reward_amount:
 *         type: number
 *         example: 114500
 *         description: 누적 리워드
 *
 *   RewardHistoryStatusListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_RewardHistoryStatusList'
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
 *         example: "/api/private/reward/${path}"
 *         description: api 경로
 */