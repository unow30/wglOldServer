/**
 * Created by gunucklee on 2021. 08. 22.
 */
const axios = require('axios');
const {log} = require("debug");

axios.defaults.headers.common['Authorization'] = 'key=AAAAH1HxpKo:APA91bEGjPgOgXK2xZ-uqZHiR_PT69tO4knZt6ZCRpAXRESsnuY23MXWFneIQ-EALixYNkcUZg0iNczMW8eXc9ZLp6_dd1Kmz0t4rw5rJwboLwG-65hS0nyNps5OchEw72zP8dzlLNIa';
axios.defaults.headers.post['Content-Type'] = 'application/json';
// fcm_type
// 위글 앱
// 0: 위글 주문 알림 -> 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
// 1: 리뷰 영상 등록 알림
// 2: 리워드 지급 알림
// 3: 댓글 등록 알림
// 4: 대댓글 등록 알림
// 5: 문의 등록 알림
// 6: 위글가입 포인트 알림
// 판매자사이트
// 0: 주문 상품 상태 알림 -> 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
// 7: 문의사항 답변 등록 알림
// 관리자사이트
// 8: 위글 리뷰영상 이벤트 심사 알림
// 0: 위글 리뷰영상 이벤트 심사 거절 -> 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)


module.exports = {

    fcmCreateOrderList : async function(push_token_list){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "registration_ids": push_token_list,
            "priority": "high",
            "data": {
                "title": "위글 주문 알림",
                "message": "주문이 접수되었습니다. 판매자페이지를 확인해주세요.",
                "channel" : "주문 알림",
                "fcm_type" : "0",
            },
            "notification": {
                "title": "위글 주문 알림",
                "body": "주문이 접수되었습니다. 판매자페이지를 확인해주세요.",
                "channel" : "주문 알림",
                "fcm_type" : "0",
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
            },
        }).catch((e) => console.log(e));
    },
    fcmReviewVideoSingle : async function(item){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "to": item['push_token'],
            "priority": "high",
            "data": {
                "user_uid": `${item['seller_uid']}`,
                "title": "리뷰 영상 등록 알림",
                "message": `${item['reviewer_nickname']}님이 ${item['product_name']} 상품에 대한 리뷰 영상을 등록했습니다.`,
                "channel" : "리뷰 영상 등록 알림",
                "video_uid" : `${item['uid']}`,
                "fcm_type" : "1",
                "video_from" : `${item['is_deal']}`,
            },
            "notification": {
                "user_uid": `${item['seller_uid']}`,
                "title": "리뷰 영상 등록 알림",
                "body": `${item['reviewer_nickname']}님이 ${item['product_name']} 상품에 대한 리뷰 영상을 등록했습니다.`,
                "channel" : "리뷰 영상 등록 알림",
                "video_uid" : `${item['uid']}`,
                "fcm_type" : "1",
                "video_from" : `${item['is_deal']}`,
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
            },
        }).then((res)=>{
            return  JSON.parse(res['config']['data'])
        }).catch((e) => console.log(e));
    },
    fcmRewardVideoSingle : async function(item){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "to": item['push_token'],
            "priority": "high",
            "data": {
                "title": "리워드 지급 알림",
                "message": `${item['product_name']} 상품에 대한 리뷰 리워드 ${item['amount']}원이 지급 되었습니다.`,
                "channel" : "리워드 알림",
                "reward_uid": `${item['reward_uid']}`,
                "fcm_type" : "2",
            },
            "notification": {
                "title": "리워드 지급 알림",
                "body": `${item['product_name']} 상품에 대한 리뷰 리워드 ${item['amount']}원이 지급 되었습니다.`,
                "channel" : "리워드 알림",
                "reward_uid": `${item['reward_uid']}`,
                "fcm_type" : "2",
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
            },
        }).catch((e) => console.log(e));
    },
    fcmVideoCommentSingle : async function(item){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "to": item['push_token'],
            "priority": "high",
            "data": {
                "user_uid": `${item['video_user_uid']}`,
                "title": "댓글 등록 알림",
                "message": `${item['nickname']}님이 회원님의 영상에 댓글을 달았습니다. : ${item['content']}`,
                "channel" : "댓글 알림",
                "target_uid" : `${item['uid']}`,
                "video_uid" : `${item['video_uid']}`,
                "fcm_type" : "3",
                "video_from" : `${item['is_deal']}`,
            },
            "notification": {
                "user_uid": `${item['video_user_uid']}`,
                "title": "댓글 등록 알림",
                "body": `${item['nickname']}님이 회원님의 영상에 댓글을 달았습니다. : ${item['content']}`,
                "channel" : "댓글 알림",
                "target_uid" : `${item['uid']}`,
                "video_uid" : `${item['video_uid']}`,
                "fcm_type" : "3",
                "video_from" : `${item['is_deal']}`,
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
            },
        }).then((res)=>{
            return  JSON.parse(res['config']['data'])
        }).catch((e) => console.log(e));
    },
    fcmNestedCommentSingle : async function(item){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "to": item['push_token'],
            "priority": "high",
            "data": {
                "title": "대댓글 등록 알림",
                "message": `${item['nickname']}님이 회원님의 댓글에 대댓글을 달았습니다. : ${item['content']}`,
                "channel" : "대댓글 알림",
                "video_uid" : `${item['video_uid']}`,
                "fcm_type" : "4",
                "video_from" : `${item['is_deal']}`,
            },
            "notification": {
                "title": "대댓글 등록 알림",
                "body": `${item['nickname']}님이 회원님의 댓글에 대댓글을 달았습니다. : ${item['content']}`,
                "channel" : "대댓글 알림",
                "video_uid" : `${item['video_uid']}`,
                "fcm_type" : "4",
                "video_from" : `${item['is_deal']}`,
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
            },
        }).catch((e) => console.log(e));
    },
    fcmProductQnASingle : async function(item, question_type){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "to": item['push_token'],
            "priority": "high",
            "data": {
                "title": "문의 등록 알림",
                "message": `${item['product_name']}에 대한 ${question_type} 문의가 등록되었습니다. 판매자 페이지를 확인해주세요. : ${item['question_content']}`,
                "channel" : "문의 알림",
                "product_qna_uid": `${item['product_qna_uid']}`,
                "fcm_type" : "5",
            },
            "notification": {
                "title": "문의 등록 알림",
                "body": `${item['product_name']}에 대한 ${question_type} 문의가 등록되었습니다. 판매자 페이지를 확인해주세요. : ${item['question_content']}`,
                "channel" : "문의 알림",
                "product_qna_uid": `${item['product_qna_uid']}`,
                "fcm_type" : "5",
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
            },
        }).catch((e) => console.log(e));
    },

    fcmEventPoint3000Single : async function(item){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "to": item['push_token'],
            "priority": "high",
            "data": {
                "user_uid": `${item['user_uid']}`,
                "title": "위글가입 포인트 알림",
                "message": `위글 가입을 환영합니다! 바로 사용 가능한 3,000 포인트를 지급하였습니다.`,
                "channel" : "포인트 알림",
                "target_uid": `${item['point_uid']}`,
                "fcm_type" : "6",
            },
            "notification": {
                "user_uid": `${item['user_uid']}`,
                "title": "위글가입 포인트 알림",
                "body": `위글 가입을 환영합니다! 바로 사용 가능한 3,000 포인트를 지급하였습니다.`,
                "channel" : "포인트 알림",
                "target_uid": `${item['point_uid']}`,
                "fcm_type" : "6",
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
            },
        }).then((res)=>{
            return  JSON.parse(res['config']['data'])
        }).catch((e) => console.log(e));
    },

};