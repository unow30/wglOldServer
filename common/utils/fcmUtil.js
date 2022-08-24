/**
 * Created by gunucklee on 2021. 08. 22.
 */
const axios = require('axios');
const {log} = require("debug");

axios.defaults.headers.common['Authorization'] = 'key=AAAAH1HxpKo:APA91bEGjPgOgXK2xZ-uqZHiR_PT69tO4knZt6ZCRpAXRESsnuY23MXWFneIQ-EALixYNkcUZg0iNczMW8eXc9ZLp6_dd1Kmz0t4rw5rJwboLwG-65hS0nyNps5OchEw72zP8dzlLNIa';
axios.defaults.headers.post['Content-Type'] = 'application/json';
// fcm 알림 타입
// alarm_type
// 위글 앱 서버 실행
// 0: 위글 주문 알림 => 판매자에게 전달. 받는 uid 없음. 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
// 1: 리뷰 영상 등록 알림 => 판매자에게 전달. 받는 uid 없음
// 2: 리워드 지급 알림 => 리뷰어에게 전달. 받는 uid 없음. 리워드 상세 페이지 실행
// 3: 댓글 등록 알림 => 비디오 업로더에게 전달. 댓글 uid
// 4: 대댓글 등록 알림 => 댓글 작성자에게 전달. 대댓글 uid
// 5: 문의 등록 알림 => 판매자에게 전달. 받는 uid 없음. 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
// 6: 위글가입 포인트 알림 => 회원가입자에게 전달. 받는 uid 없음
// 7: 상품 구매 확정 알림 => 판매자에게 전달. 받는 uid 없음. 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)
//
// 판매자사이트 서버 실행
// 8: 배송 시작 알림 => 구매자에게 전달. 주문 uid
// 9: 구매 확정 요청 알림 => 구매자에게 전달. 상품 구매 목록 실행(/api/private/order/list)
// 10: 문의사항 답변 등록 알림 => 구매자에게 전달. 나의 문의하기 목록 실행(/api/private/qna/list/me)
// 11: 선물 기한 알림 => 주문 uid(보낸사람이 취소)
//
// 관리자사이트 서버 실행
// 12: 위글 리뷰영상 이벤트 심사 승인 => 리뷰어에게 전달. 받는 uid 없음
// 13: 위글 리뷰영상 이벤트 심사 거절 => 위글 앱 실행(위글앱으로 화면을 열 수 없는 경우)



module.exports = {

    fcmCreateOrderList : async function(push_token_list){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "registration_ids": push_token_list,
            "priority": "high",
            "data": {
                "title": "위글 주문 알림",
                "message": "주문이 접수되었습니다. 판매자페이지를 확인해주세요.",
                "channel" : "위글 주문 알림",
                "alarm_type" : "0",
                "icon_filename": "order.png"
            },
            "notification": {
                "title": "위글 주문 알림",
                "body": "주문이 접수되었습니다. 판매자페이지를 확인해주세요.",
                "channel" : "위글 주문 알림",
                "alarm_type" : "0",
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
                "mutable-content": "1",
                "icon_filename": "order.png"
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
                "alarm_type" : "1",
                "video_from" : `${item['is_deal']}`,
                "icon_filename": "review.png"
            },
            "notification": {
                "user_uid": `${item['seller_uid']}`,
                "title": "리뷰 영상 등록 알림",
                "body": `${item['reviewer_nickname']}님이 ${item['product_name']} 상품에 대한 리뷰 영상을 등록했습니다.`,
                "channel" : "리뷰 영상 등록 알림",
                "video_uid" : `${item['uid']}`,
                "alarm_type" : "1",
                "video_from" : `${item['is_deal']}`,
                "icon_filename": "review.png",
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
                "mutable-content": "1"
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
                "user_uid": item['reward_user_uid'],
                "title": "리워드 지급 알림",
                "message": `${item['product_name']} 상품에 대한 리뷰 리워드 ${item['amount']}원이 지급 되었습니다.`,
                "channel" : "리워드 지급 알림",
                "alarm_type" : "2",
                "icon_filename": "reward.png"
            },
            "notification": {
                "user_uid": item['reward_user_uid'],
                "title": "리워드 지급 알림",
                "body": `${item['product_name']} 상품에 대한 리뷰 리워드 ${item['amount']}원이 지급 되었습니다.`,
                "channel" : "리워드 지급 알림",
                "alarm_type" : "2",
                "icon_filename": "reward.png",
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
                "mutable-content": "1"
            },
        }).then((res)=>{
            return JSON.parse(res['config']['data'])
        }).catch((e) => console.log(e));
    },
    fcmOrderProductConfirm : async function(item){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "to" : item['push_token'],
            "priority": "high",
            "data": {
                "title": "상품 구매 확정 알림",
                "message": `${item['product_name']}의 구매확정건이 있습니다. 판매자페이지를 확인해주세요.`,
                "channel" : "상품 구매 확정 알림",
                "alarm_type" : "7",
                "icon_filename": 'order.png',
            },
            "notification": {
                "title": "상품 구매 확정 알림",
                "body": `${item['product_name']}의 구매확정건이 있습니다. 판매자페이지를 확인해주세요.`,
                "channel" : "상품 구매 확정 알림",
                "alarm_type" : "7",
                "icon_filename": 'order.png',
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
                "mutable-content": "1"
            },
        }).then((res)=>{;
            return JSON.parse(res['config']['data'])
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
                "channel" : "댓글 등록 알림",
                "target_uid" : `${item['uid']}`,
                "video_uid" : `${item['video_uid']}`,
                "alarm_type" : "3",
                "icon_filename": `qna.png`,
                "video_from" : `${item['is_deal']}`,
            },
            "notification": {
                "user_uid": `${item['video_user_uid']}`,
                "title": "댓글 등록 알림",
                "body": `${item['nickname']}님이 회원님의 영상에 댓글을 달았습니다. : ${item['content']}`,
                "channel" : "댓글 등록 알림",
                "target_uid" : `${item['uid']}`,
                "video_uid" : `${item['video_uid']}`,
                "alarm_type" : "3",
                "icon_filename": "qna.png",
                "video_from" : `${item['is_deal']}`,
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
                "mutable-content": "1"
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
                "user_uid": item['comment_user_uid'],
                "title": "대댓글 등록 알림",
                "message": `${item['nickname']}님이 회원님의 댓글에 대댓글을 달았습니다. : ${item['content']}`,
                "channel" : "대댓글 등록 알림",
                "target_uid": `${item['uid']}`,
                "video_uid" : `${item['video_uid']}`,
                "alarm_type" : "4",
                "icon_filename": "qna.png",
                "video_from" : `${item['is_deal']}`,
            },
            "notification": {
                "user_uid": item['comment_user_uid'],
                "title": "대댓글 등록 알림",
                "body": `${item['nickname']}님이 회원님의 댓글에 대댓글을 달았습니다. : ${item['content']}`,
                "channel" : "대댓글 등록 알림",
                "target_uid": `${item['uid']}`,
                "video_uid" : `${item['video_uid']}`,
                "alarm_type" : "4",
                "icon_filename": "qna.png",
                "video_from" : `${item['is_deal']}`,
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
                "mutable-content": "1"
            },
        }).then((res)=>{
            return  JSON.parse(res['config']['data'])
        }).catch((e) => console.log(e));
    },
    fcmProductQnASingle : async function(item, question_type){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "to": item['push_token'],
            "priority": "high",
            "data": {
                "user_uid": item['seller_uid'],
                "title": "문의 등록 알림",
                "message": `${item['product_name']}에 대한 ${question_type} 문의가 등록되었습니다. : ${item['question']}`,
                "channel" : "문의 등록 알림",
                "alarm_type" : "5",
                "icon_filename": "qna.png"
            },
            "notification": {
                "user_uid": item['seller_uid'],
                "title": "문의 등록 알림",
                "body": `${item['product_name']}에 대한 ${question_type} 문의가 등록되었습니다. 판매자 페이지를 확인해주세요. : ${item['question']}`,
                "channel" : "문의 등록 알림",
                "alarm_type" : "5",
                "icon_filename": "qna.png",
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
                "mutable-content": "1"
            },
        }).then((res)=>{
            return JSON.parse(res['config']['data']);
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
                "channel" : "위글가입 포인트 알림",
                "alarm_type" : "6",
                "icon_filename": "point.png"
            },
            "notification": {
                "user_uid": `${item['user_uid']}`,
                "title": "위글가입 포인트 알림",
                "body": `위글 가입을 환영합니다! 바로 사용 가능한 3,000 포인트를 지급하였습니다.`,
                "channel" : "위글가입 포인트 알림",
                "alarm_type" : "6",
                "icon_filename": "point.png",
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
                "mutable-content": "1"
            },
        }).then((res)=>{
            return  JSON.parse(res['config']['data'])
        }).catch((e) => console.log(e));
    },

    fcmPointRecommendCodeList : async function(item){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "registration_ids": item['push_token_list'],
            "priority": "high",
            "data": {
                "title": "위글 추천인 포인트 알림",
                "message": "위글 추천인 이벤트! 바로 사용 가능한 포인트를 지급하였습니다.",
                "channel" : "위글 추천인 포인트 알림",
                "alarm_type" : "6",
            },
            "notification": {
                "title": "위글 추천인 포인트 알림",
                "body": "위글 추천인 이벤트! 바로 사용 가능한 포인트를 지급하였습니다.",
                "channel" : "위글 추천인 포인트 알림",
                "alarm_type" : "6",
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
                "mutable-content": "1",
            },
        }).then((res)=>{
            return JSON.parse(res['config']['data']);
        }).catch((e) => console.log(e));
    },
    fcmGiftOvertimeSingle : async function(item){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "to" : item['push_token'],
            "priority": "high",
            "data": {
                "title": "선물 기한 알림",
                "message": `${item['recipient_name']} 님에게 선물해준 ${item['product_name']} 선물의 수락 기한이 지나 1~2일내로 구매가 자동 취소됩니다.`,
                "channel" : "선물 기한 알림",
                "target_uid" : `${item['order_uid']}`,
                "alarm_type" : "11",
                "icon_filename": 'order.png',
            },
            "notification": {
                "title": "선물 기한 알림",
                "body": `${item['recipient_name']} 님에게 선물해준 ${item['product_name']} 선물의 수락 기한이 지나 1~2일내로 구매가 자동 취소됩니다.`,
                "channel" : "선물 기한 알림",
                "target_uid" : `${item['order_uid']}`,
                "alarm_type" : "11",
                "icon_filename": 'order.png',
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
                "mutable-content": "1"
            },
        }).catch((e) => console.log(e));
    },
    fcmGonguCancelList : async function(item){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "registration_ids": item,
            "priority": "high",
            "data": {
                "title": "위글 추천인 포인트 알림",
                "message": "위글 추천인 이벤트! 바로 사용 가능한 포인트를 지급하였습니다.",
                "channel" : "위글 추천인 포인트 알림",
                "alarm_type" : "6",
            },
            "notification": {
                "title": "위글 추천인 포인트 알림",
                "body": "위글 추천인 이벤트! 바로 사용 가능한 포인트를 지급하였습니다.",
                "channel" : "위글 추천인 포인트 알림",
                "alarm_type" : "6",
                "sound" : "default",
                "badge": "1",
                "content-available" : "true",
                "apns-priority" : "5",
                "badge count" : "0",
                "mutable-content": "1",
            },
        }).then((res)=>{
            return JSON.parse(res['config']['data']);
        }).catch((e) => console.log(e));
    },
};