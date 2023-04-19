/**
 * Created by yunhokim on 2022. 02. 04.
 *
 * @swagger
 * definitions:
 *   Proc_Create_Block:
 *     allOf:
 *       - $ref: '#/definitions/BlockTable'
 *       - type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: Block uid
 *       is_deleted:
 *         type: number
 *         example: 0
 *         description: |
 *           삭제 여부
 *           * 0: false
 *           * 1: true (삭제됨)
 *         enum: [0,1]
 *       created_time:
 *         type: string
 *         example: 2021-01-01 00:00:00
 *         description: 최초 생성 날짜
 *       updated_time:
 *         type: string
 *         example: 2021-01-01 00:00:00
 *         description: 마지막 수정한 날짜
 *       source_uid:
 *         type: number
 *         example: 1
 *         description: 차단한 유저 uid
 *       target_uid:
 *         type: number
 *         example: 1
 *         description: |
 *           차단할 uid
 *       type:
 *         type: number
 *         example: 1
 *         description: |
 *           차단 타입
 *           * 1: 영상 uid 차단
 *           * 2: 댓글 uid 차단
 *           * 3: 대댓글 uid 차단
 *           * 4: 유저 uid 차단
 *         enum: [1, 2, 3, 4]
 *
 *   BlockApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Create_Block'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/block"
 *         description: api 경로
 */


