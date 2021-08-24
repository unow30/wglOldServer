/**
 * Created by gunucklee on 2021. 08. 22.
 */
const axios = require('axios');
const {log} = require("debug");

axios.defaults.headers.common['Authorization'] = 'key=AAAAH1HxpKo:APA91bEGjPgOgXK2xZ-uqZHiR_PT69tO4knZt6ZCRpAXRESsnuY23MXWFneIQ-EALixYNkcUZg0iNczMW8eXc9ZLp6_dd1Kmz0t4rw5rJwboLwG-65hS0nyNps5OchEw72zP8dzlLNIa';
axios.defaults.headers.post['Content-Type'] = 'application/json';

module.exports = {

    fcmCreateOrderList : async function(push_token_list){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "registration_ids": push_token_list,
            "priority": "high",
            "data": {
                "title": "위글 주문 알림",
                "message": "주문이 접수되었습니다. 판매자페이지를 확인해주세요.",
                "channel" : "주문 알림",
            }
        }).catch((e) => console.log(e));
    },
    fcmReviewVideoSingle : async function(push_token, product_name){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "to": push_token,
            "priority": "high",
            "data": {
                "title": "리뷰 영상 등록 알림",
                "message": `${product_name} 상품에 대한 리뷰 영상이 등록되었습니다.  판매자페이지를 영상 리뷰 관리 메뉴에서 확인 가능합니다.`,
                "channel" : "리뷰 영상 등록 알림",
            }
        }).catch((e) => console.log(e));
    },
    fcmRewardVideoSingle : async function(push_token, product_name, reward_amount){
        return  await axios.post('https://fcm.googleapis.com/fcm/send', {
            "to": push_token,
            "priority": "high",
            "data": {
                "title": "리워드 지급 알림",
                "message": `${product_name} 상품에 대한 리뷰 리워드 ${reward_amount}원이 지급 되었습니다.`,
                "channel" : "리워드 알림",
            }
        }).catch((e) => console.log(e));
    },
};