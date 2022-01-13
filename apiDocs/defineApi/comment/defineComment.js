/**
 * Created by gunucklee on 2022. 01. 11.
 *
 * @swagger
 * definitions:
 *   Proc_Single_Comment:
 *     allOf:
 *       - $ref: '#/definitions/CommentTable'
 *       - type: object
 *         properties:
 *           video_uid:
 *             type: number
 *             example: 5
 *             description: 영상 uid
 *           video_user_uid:
 *             type: number
 *             example: 13
 *             description: 영상 올린 유저 uid
 *           nickname:
 *             type: string
 *             example: "깜도니"
 *             description: 댓글 단 유저 닉네임
 *           filename:
 *             type: string
 *             example: "abcdefg.jpg"
 *             description: 댓글 단 유저 프로필 파일명
 *           is_deal:
 *             type: number
 *             example: 0
 *             description: |
 *               위글 딜 진행 여부
 *               * 0: 위글딜 아님
 *               * 1: 위글딜 진행 중
 *               * 2: 위글딜 심사 중
 *             enum: [0,1,2]
 *           is_liked:
 *             type: number
 *             example: 0
 *             description: |
 *               좋아요 여부
 *               * 0: 비활성화
 *               * 1: 활성화
 *             enum: [0,1]
 *           count_like:
 *             type: number
 *             example: 3
 *             description: 좋아요 갯수
 *           count_comment:
 *             type: number
 *             example: 3
 *             description: 댓글 갯수
 *
 *   CommentApi:
 *     type: object
 *     properties:
 *       item:
 *           $ref: '#/definitions/Proc_Single_Comment'
 *       method:
 *         type: string
 *         example: "${method}"
 *         description: 메서드 형식
 *       url:
 *         type: string
 *         example: "/api/private/comment/${path}"
 *         description: api 경로
 */



