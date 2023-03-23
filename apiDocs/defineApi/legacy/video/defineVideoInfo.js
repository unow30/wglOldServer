/**
 * Created by gunucklee on 2022. 01. 11.
 *
 * @swagger
 * definitions:
 *   Proc_Single_VideoInfo:
 *     allOf:
 *       - $ref: '#/definitions/VideoTable'
 *       - type: object
 *         properties:
 *           name:
 *             type: string
 *             example: "왕밤빵왕만두"
 *             description: 상품명
 *           nickname:
 *             type: string
 *             example: "이건욱"
 *             description: 영상 올린 사람의 이름
 *           video_filename:
 *             type: string
 *             example: "ca590826fbcd192fd987a9b446b98abb.mp4"
 *             description: 영상 파일명
 *           image_filename:
 *             type: string
 *             example: "cddaad161993eca3b511f4729ea5cc89.png"
 *             description: 영상 올린 사람의 프로필 파일명
 *           is_follow:
 *             type: number
 *             example: 0
 *             description: |
 *               내 팔로우 여부
 *               * 0: 팔로우 안함
 *               * 1: 팔로우 함
 *             enum: [0,1]
 *           is_liked:
 *             type: number
 *             example: 0
 *             description: |
 *               내 좋아요 여부
 *               * 0: 좋아요 안함
 *               * 1: 좋아요 함
 *             enum: [0,1]
 *           count_like:
 *             type: number
 *             example: 3
 *             description: 좋아요 갯수
 *
 *   VideoInfoApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_VideoInfo'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/video/${path}"
 *         description: api 경로
 */



