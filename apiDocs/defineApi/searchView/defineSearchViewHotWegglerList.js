/**
 * Created by yunhokim on 2022. 02. 14.
 *
 * @swagger
 * definitions:
 *   Proc_Array_SearchViewHotWegglerList:
 *     type: object
 *     properties:
 *       user_uid:
 *         type: number
 *         example: 5
 *         description: 유저 uid
 *       nickname:
 *         type: string
 *         example: "깜돈집사"
 *         description: 유저 닉네임
 *       profile_filename:
 *         type: string
 *         example: "profile_default_image.png"
 *         description: 유저 프로필 명
 *       list:
 *         type: array
 *         items:
 *           properties:
 *             video_uid:
 *               type: number
 *               example: 1
 *               description: 비디오 uid
 *             created_time:
 *               type: string
 *               example: "2021-01-01 00:00:00"
 *               description: 최초 생성 날짜
 *             count_view:
 *               type: number
 *               example: 394
 *               description: 조회 갯수
 *             video_filename:
 *               type: string
 *               example: "ca590826fbcd192fd987a9b446b98abb.mp4"
 *               description: 영상 파일명
 *             video_thumbnail:
 *               type: string
 *               example: "video_thumbnail.png"
 *               description: 영상 썸네일 명
 *
 *   SearchViewHotWegglerListApi:
 *     type: object
 *     properties:
 *       item:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Proc_Array_SearchViewHotWegglerList'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/searchview/hotweggler/list/${path}"
 *         description: api 경로
 */

