#2021-07-12 (MON) changed by gun uck LEE

create
definer = weggle@`%` procedure w_seller_update_weggle_deal_apply(IN in_product_uid int,
IN in_deal_starttime timestamp,
IN in_deal_endtime timestamp,
IN in_deal_discount_rate int,
IN in_deal_price_discount int)
BEGIN

    set sql_safe_updates = 0;

    update tbl_product
    set updated_time    = now()
      , is_deal          = 2
      , deal_starttime = in_deal_starttime
      , deal_endtime = in_deal_endtime
      , deal_discount_rate = in_deal_discount_rate
      , deal_price_discount = in_deal_price_discount
    where uid = in_product_uid
    ;

    set sql_safe_updates = 1;

    select _product.*
    from tbl_product as _product
    where uid = in_product_uid
    ;

END;



####################################################################################################################################
####################################################################################################################################



create
definer = weggle@`%` procedure w_seller_create_product(IN in_user_uid int, IN in_name tinytext,
IN in_sale_type varchar(45), IN in_category int,
IN in_detail_info text, IN in_price_original int,
IN in_price_discount int, IN in_discount_rate int)
#                                                            IN in_delivery_price int, IN in_delivery_free int,
#                                                            IN in_delivery_price_plus int,
#                                                            IN in_delivery_method tinytext, IN in_delivery_time tinytext)
BEGIN

    insert into tbl_product
    set updated_time = now()
      , user_uid    = in_user_uid
      , name   = in_name
      , sale_type   = in_sale_type
      , category   = in_category
      , detail_info = in_detail_info
      , price_original   = in_price_original
      , price_discount   = in_price_discount
      , discount_rate   = in_discount_rate
#       , delivery_price   = in_delivery_price
#       , delivery_free   = in_delivery_free
#       , delivery_price_plus   = in_delivery_price_plus
#       , delivery_method   = in_delivery_method
#       , delivery_time   = in_delivery_time
    ;

    select _product.*
    from tbl_product as _product
    where _product.uid = last_insert_id();

END;



####################################################################################################################################
####################################################################################################################################



create
definer = weggle@`%` procedure w_seller_update_user(IN in_user_uid int, IN in_nickname varchar(45),
IN in_about tinytext, IN in_phone tinytext,
IN in_address tinytext, IN in_address_detail tinytext,
IN in_latitude double, IN in_longitude double,
IN in_delivery_price int, IN in_delivery_free int,
IN in_delivery_price_plus int, IN in_corp_name tinytext,
IN in_corp_reg_num int, IN in_corp_sales_report int)
BEGIN

    set sql_safe_updates = 0;

    update tbl_user
    set updated_time = now()
      , nickname          = in_nickname
      , about          = in_about
      , phone          = in_phone
      , address          = in_address
      , address_detail = in_address_detail
      , latitude        = in_latitude
      , longitude       = in_longitude
      , delivery_price = in_delivery_price
      , delivery_free = in_delivery_free
      , delivery_price_plus = in_delivery_price_plus
      , corp_name       = in_corp_name
      , corp_reg_num    = in_corp_reg_num
      , corp_sales_report = in_corp_sales_report
    where uid = in_user_uid
    ;

    set sql_safe_updates = 1;

    call w_seller_select_user_from_uid(in_user_uid);
END;











####################################################################################################################################
####################################################################################################################################


# 2021-07-13

## w_seller_select_calculate_reward_list 변경
create
definer = weggle@`%` procedure w_seller_select_calculate_reward_list(IN in_start int, IN in_length int,
IN in_sort_column int,
IN in_sort_type varchar(5),
IN in_seller_uid int,
IN in_start_date date, IN in_end_date date,
IN in_product_name varchar(45),
IN in_user_nickname varchar(45))
BEGIN
select _reward.*
, _user.nickname
, _user.email
, _user.phone
, _user.is_deleted as is_deleted_user
, _video.filename as filename_video
,(select func_select_image_target(_reward.product_uid, 2)) as filename_image
,_product.name as product_name
,_order.use_point
,_order.use_reward
,_order.price_total
,_order.price_delivery
,_order.price_payment
from tbl_reward as _reward
inner join tbl_user as _user
on _user.uid = _reward.user_uid
and _user.is_deleted = 0
inner join tbl_video as _video
on _reward.video_uid = _video.uid
inner join tbl_product as _product
on _reward.product_uid = _product.uid
inner join tbl_order as _order
on _reward.order_uid = _order.uid
where _reward.is_deleted = 0
and _reward.seller_uid = in_seller_uid
and _reward.state = 1
and date(_reward.created_time) >= in_start_date
and date(_reward.created_time) <= in_end_date
and case when !isnull(in_product_name) then replace(_product.name,' ','') like concat('%', replace(in_product_name,' ',''), '%')
else true end
and case when !isnull(in_user_nickname) then replace(_user.nickname,' ','') like concat('%', replace(in_user_nickname,' ',''), '%')
else true end
order by (case when in_sort_column = 0 and in_sort_type = 'asc' then _reward.uid end) * 1,
(case when in_sort_column = 0 and in_sort_type = 'desc' then _reward.uid end) * 1 desc
#              (case when in_sort_column = 2 and in_sort_type = 'asc' then _product.name end),
#              (case when in_sort_column = 2 and in_sort_type = 'desc' then _product.name end) desc
    limit in_start, in_length;
END;



####################################################################################################################################
####################################################################################################################################



## w_seller_select_calculate_reward_info 변경(테스트서버 프로시저 이름이 into로 되어있어 변경)

create
definer = weggle@`%` procedure w_seller_select_calculate_reward_info(IN in_seller_uid int, IN in_start_date date, IN in_end_date date)
BEGIN
select
#          ,리뷰영상으로 발생한 누적 리워드원
           sum(_reward.amount) as total_reward
#          ,리뷰영상으로 판매한 총 상품 금액 (결제금액 - 배송금액)
           ,sum(_order.price_payment - _order.price_delivery) as total_payment
#          ,리뷰영상 누적 조회수 video.count_view
           ,sum(_video.count_view) as total_view
#          ,리뷰영상의 누적 좋아요 수 count_like
           ,sum(_video.count_like) as total_like
    from tbl_reward as _reward
    inner join tbl_video as _video
        on _video.uid = _reward.video_uid
#         and _video.type = 2 리뷰어가 올린 비디오는 2 임시 데이터는 타입 신경 안쓰고 있다.
    inner join tbl_order as _order
        on _order.uid = _reward.order_uid
            and _reward.state =1
    where _reward.is_deleted = 0
      and _reward.seller_uid = in_seller_uid
      and date(_reward.created_time) >= in_start_date
      and date(_reward.created_time) <= in_end_date ;
END;



####################################################################################################################################
####################################################################################################################################



## 
alter table tbl_order_product modify column delivery_code tinytext null comment '택배사 코드번호';


## func_select_order_product_object_list 변경(where절 seller_uid 추가)
create
definer = weggle@`%` function func_select_order_product_object_list(in_order_uid int, in_seller_uid int) returns text
BEGIN

    declare v_value text default null;

    select concat('[', group_concat(_tbl.obj), ']') into v_value
    from (
             select concat('{"uid":', _order_product.uid,
#                            ', "video_uid":', _order_product.video_uid,
                           ', "count":', _order_product.count,
#                            ', "price_original":', _order_product.price_original,
                           ', "payment":', _order_product.payment,
                           ', "status":', _order_product.status,
                           ', "name":', '"', _product.name, '"',
                           ', "option_ids":', '"', _order_product.option_ids, '"',
                           ', "option_names":', '"', (select func_select_product_option_names(_order_product.product_uid, _order_product.option_ids)), '"',
#                            ', "option_price":', '"', _option.option_price, '"',
                           ', "option_price":', ( select  func_select_options_total_price(_product.uid, _order_product.option_ids)),
                           ', "cancel_reason":', '"', ifnull(_order_product.cancel_reason,' '), '"',
                           ', "detail_reason":', '"', ifnull(_order_product.detail_reason,' '), '"',
                           ', "delivery_code":', '"', ifnull(_order_product.delivery_code,' '), '"',
                           ', "delivery_number":', '"', ifnull(_order_product.delivery_number,' '), '"',
                           '}') as obj
             from tbl_order_product as _order_product
                      inner join tbl_product as _product
                                 on _product.uid = _order_product.product_uid
                                     and _product.is_deleted = 0
                      inner join tbl_product_option as _option
                                 on _option.product_uid = _product.uid
                                     and _option.is_deleted = 0
             where _order_product.is_deleted = 0
               and _order_product.order_uid = in_order_uid
               and _order_product.seller_uid = in_seller_uid
#                and find_in_set(_option.option_id, _order_product.option_ids)
#                 and find_in_set(_order_product.status, in_order_product_status)
             group by _order_product.uid
         ) as _tbl;


    return v_value;

end;
