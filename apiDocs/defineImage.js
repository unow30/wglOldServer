/**
 * Created by hyunhunhwang on 2021. 01. 12.
 *
 * @swagger
 * definitions:
 *   Image:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: 이미지 uid
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
 *         example: 2021-01-07 08:52:23
 *         description: 최초 생성 날짜
 *       updated_time:
 *         type: string
 *         example: 2021-01-07 08:52:23
 *         description: 마지막 수정한 날짜
 *       user_uid:
 *         type: number
 *         example: 3
 *         description: 이미지 등록한 유저 uid
 *       target_uid:
 *         type: number
 *         example: 7
 *         description: |
 *           대상 UID
 *           * type에 따라 대상은 변경됨
 *       type:
 *         type: number
 *         example: 2
 *         description: |
 *           이미지 타입
 *           * 1: 프로필 이미지
 *           * 2: 상품 이미지
 *           * 3: 영상 샘플 이미지
 *           * 4: 광고 이미지
 *           * 5: 상품 상세 이미지
 *           * 101: 신분증 이미지
 *           * 102:  통장 이미지
 *         enum: [1,2,3,4,5,101,102]
 *       filename:
 *         type: string
 *         example: "cddaad161993eca3b511f4729ea5cc89.png"
 *         description: 이미지 파일명
 */


