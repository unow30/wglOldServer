/**
 * Created by gunucklee on 2021. 08. 22.
 */
const axios = require('axios');
const {log} = require("debug");

axios.defaults.headers.common['Authorization'] = 'key=AAAAH1HxpKo:APA91bEGjPgOgXK2xZ-uqZHiR_PT69tO4knZt6ZCRpAXRESsnuY23MXWFneIQ-EALixYNkcUZg0iNczMW8eXc9ZLp6_dd1Kmz0t4rw5rJwboLwG-65hS0nyNps5OchEw72zP8dzlLNIa';
axios.defaults.headers.post['Content-Type'] = 'application/json';
// fcm_type
// 0: 위글 주문 알림
// 1: 리뷰 영상 등록 알림
// 2: 리워드 지급 알림
// 3: 댓글 등록 알림
// 4: 대댓글 등록 알림
// 5: 문의 등록 알림
// 판매자사이트
// 6: 주문 상품 알림
// 7: 문의사항 답변 등록 알림

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
                "badge": "0",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "1",
            },
        }).catch((e) => console.log(e));
    },
    fcmReviewVideoSingle : async function(item){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "to": item['push_token'],
            "priority": "high",
            "data": {
                "title": "리뷰 영상 등록 알림",
                "message": `${item['product_name']} 상품에 대한 리뷰 영상이 등록되었습니다.  판매자페이지를 영상 리뷰 관리 메뉴에서 확인 가능합니다.`,
                "channel" : "리뷰 영상 등록 알림",
                "video_uid" : `${item['uid']}`,
                "fcm_type" : "1",
                "video_from" : `${item['is_deal']}`,
            },
            "notification": {
                "title": "리뷰 영상 등록 알림",
                "body": `${item['product_name']} 상품에 대한 리뷰 영상이 등록되었습니다.  판매자페이지를 영상 리뷰 관리 메뉴에서 확인 가능합니다.`,
                "channel" : "리뷰 영상 등록 알림",
                "video_uid" : `${item['uid']}`,
                "fcm_type" : "1",
                "video_from" : `${item['is_deal']}`,
                "sound" : "default",
                "badge": "0",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "1",
            },
        }).catch((e) => console.log(e));
    },
    fcmRewardVideoSingle : async function(item){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "to": item['push_token'],
            "priority": "high",
            "data": {
                "title": "리워드 지급 알림",
                "message": `${item['product_name']} 상품에 대한 리뷰 리워드 ${item['reward_amount']}원이 지급 되었습니다.`,
                "channel" : "리워드 알림",
                "fcm_type" : "2",
            },
            "notification": {
                "title": "리워드 지급 알림",
                "body": `${item['product_name']} 상품에 대한 리뷰 리워드 ${item['reward_amount']}원이 지급 되었습니다.`,
                "channel" : "리워드 알림",
                "fcm_type" : "2",
                "sound" : "default",
                "badge": "0",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "1",
            },
        }).catch((e) => console.log(e));
    },
    fcmVideoCommentSingle : async function(item){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "to": item['push_token'],
            "priority": "high",
            "data": {
                "title": "댓글 등록 알림",
                "message": `${item['nickname']}님이 회원님의 영상에 댓글을 달았습니다. : ${item['content']}`,
                "channel" : "댓글 알림",
                "video_uid" : `${item['video_uid']}`,
                "fcm_type" : "3",
                "video_from" : `${item['is_deal']}`,
            },
            "notification": {
                "title": "댓글 등록 알림",
                "body": `${item['nickname']}님이 회원님의 영상에 댓글을 달았습니다. : ${item['content']}`,
                "channel" : "댓글 알림",
                "video_uid" : `${item['video_uid']}`,
                "fcm_type" : "3",
                "video_from" : `${item['is_deal']}`,
                "sound" : "default",
                "badge": "0",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "1",
            },
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
                "badge": "0",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "1",
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
                "fcm_type" : "5",
            },
            "notification": {
                "title": "문의 등록 알림",
                "body": `${item['product_name']}에 대한 ${question_type} 문의가 등록되었습니다. 판매자 페이지를 확인해주세요. : ${item['question_content']}`,
                "channel" : "문의 알림",
                "fcm_type" : "5",
                "sound" : "default",
                "badge": "0",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "1",
            },
        }).catch((e) => console.log(e));
    },

};