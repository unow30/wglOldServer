/**
 * Created by yunhokim on 2022. 02. 08.
 *
 * @swagger
 * definitions:
 *   Proc_Single_BlockUserUpdateApi:
 *     properties:
 *       block_uid:
 *         type: number
 *         example: 1
 *         description: Block_uid
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
 *       user_uid:
 *         type: number
 *         example: 1
 *         description: 차단된 유저 uid
 *       nickname:
 *         type: number
 *         example: 1
 *         description: |
 *           차단된 유저 nickname
 *       filename:
 *         type: string
 *         example: "058c812d758bfd3e013219aecfa84496.jpeg"
 *         description: 차단된 유저의 프로필 이미지
 *
 *   BlockUpdateUserApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_BlockUserUpdateApi'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/block/user"
 *         description: api 경로
 */



