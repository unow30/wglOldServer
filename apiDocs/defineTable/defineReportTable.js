/**
 * Created by gunucklee on 2022. 01. 05.
 *
 * @swagger
 * definitions:
 *   ReportTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: report uid
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
 *         example: 3
 *         description: 신고하는 유저 uid
 *       target_uid:
 *         type: number
 *         example: 121
 *         description: |
 *           신고 당하는 id
 *           * 1: 유저 신고 => 유저 uid
 *           * 2: 영상 신고 => 영상 uid
 *           * 3: 댓글 신고 => 댓글 uid
 *           * 4: 대댓글 신고 => 대댓글 uid
 *       choice_value:
 *         type: number
 *         example: 6
 *         description: |
 *           신고 선택 객관식 - 비트연산
 *           * 1: 스팸
 *           * 2: 나체 이미지 또는 성적 행위
 *           * 4: 혐오 발언 또는 상징
 *           * 8: 불법 또는 규제 상품 판매
 *           * 16: 거짓 정보 및 지적 재산권 침해
 *           * 32: 기타
 *       content:
 *         type: string
 *         example: "징그러워요 ㅠㅠㅠㅠㅠㅠ"
 *         description: 신고 내용
 *       status:
 *         type: number
 *         example: 0
 *         description: |
 *           신고 처리 상태
 *           * 0: 신고 등록
 *           * 1: 신고 처리 완료
 *       type:
 *         type: number
 *         example: 1
 *         description: |
 *           * 1: 유저 신고
 *           * 2: 영상 신고
 *           * 3: 댓글 신고
 *           * 4: 대댓글 신고
 */
