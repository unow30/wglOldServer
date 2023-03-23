/**
 * Created by gunucklee on 2022. 01. 12.
 *
 * @swagger
 * definitions:
 *   Proc_Array_RewardHistoryList:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 9
 *         description: reward uid
 *       video_uid:
 *         type: number
 *         example: 12
 *         description: video uid
 *       video_filename:
 *         type: string
 *         example: "ca590826fbcd192fd987a9b446b98abb.mov"
 *         description: 영상 파일명
 *       video_thumbnail:
 *         type: string
 *         example: "40e569f52df9ba2f51c695fdb3ce0bbbThumbnail.0000000.jpg"
 *         description: 리뷰 영상 썸네일 파일명
 *       product_uid:
 *         type: number
 *         example: 1
 *         description: 상품 uid
 *       reward_count:
 *         type: number
 *         example: 9
 *         description: 총 판매 갯수
 *       reward_amount:
 *         type: number
 *         example: 114500
 *         description: 누적 리워드
 *
 *   RewardHistoryListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_RewardHistoryList'
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