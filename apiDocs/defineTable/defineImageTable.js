/**
 * Created by gunucklee on 2022. 01. 04.
 *
 * @swagger
 * definitions:
 *   ImageTable:
 *     type: object
 *     properties:
 *       uid:
 *         type: number
 *         example: 1
 *         description: Cart uid
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
 *         example: 2
 *         description: 유저 uid
 *       target_uid:
 *         type: number
 *         example: 134
 *         description: |
 *           타겟 uid
 *           * 1: 프로필 이미지 => 유저 uid
 *           * 2: 상품 이미지 => 상품 uid
 *           * 3: 영상 샘플 이미지 => 영상 uid
 *           * 4: 광고 이미지 => 광고 uid
 *           * 5: 광고 상세 이미지 => 상품 uid
 *           * 10: 비디오 썸네일 이미지 => 비디오 Uid
 *           * 101: 신분증 이미지 => 환급 uid
 *           * 102: 통장 이미지 => 환급 uid
 *       type:
 *         type: number
 *         example: 102
 *         description: |
 *           이미지 타입
 *           * 1: 프로필 이미지
 *           * 2: 상품 이미지
 *           * 3: 영상 샘플 이미지
 *           * 4: 광고 이미지
 *           * 5: 상품 상세 이미지
 *           * 10: 비디오 썸네일 이미지
 *           * 101: 신분증 이미지
 *           * 102:  통장 이미지
 *       filename:
 *         type: string
 *         example: "569b21c4da63ebf4c906bbc28f15a91d.png"
 *         description: 이미지 파일명
 *       requested_thumbnail_image:
 *         type: string
 *         example: "569b21c4da63ebf4c906bbc28f15a91d.png"
 *         description: 심사요청한 썸네일 파일명
 */