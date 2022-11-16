const paramUtil = require('../../../common/utils/paramUtil');
const fileUtil = require('../../../common/utils/fileUtil');
const mysqlUtil = require('../../../common/utils/mysqlUtil');
const sendUtil = require('../../../common/utils/sendUtil');
const errUtil = require('../../../common/utils/errUtil');
const logUtil = require('../../../common/utils/logUtil');
const fcmUtil = require('../../../common/utils/fcmUtil');

const uploadFile = require('../../../routes/api/file/uploadFile');

let http = require('http');
let fs = require('fs');

let file_name = fileUtil.name(__filename);

module.exports = function (req, res) {
    const _funcName = arguments.callee.name;

    try{
        mysqlUtil.connectPool( async function (db_connection) {
            req.innerBody = {};
            req.innerBody['item'] = await query(req, db_connection);

            let arrr = []
            for(let i=0; i<req.innerBody['item'].length; i++){
                const item = req.innerBody['item'][i]
                const result = await queryCheck(item, db_connection)
                console.log(result, 'result')
                if(!result){
                    console.log(item, 'insert')
                    await queryInsert(item, db_connection)
                    arrr.push(item)
                }
                else{
                    console.log(item, 'not insert')
                }
            }
            console.log(arrr,'arrr')
            sendUtil.sendSuccessPacket(req, res, req.innerBody, true);

        }, function (err) {
            sendUtil.sendErrorPacket(req, res, err);
        } );

    }
    catch (e) {
        let _err = errUtil.get(e);
        sendUtil.sendErrorPacket(req, res, _err);
    }
}

async function query(req, db_connection) {
    return await new Promise(async(resolve, reject)=>{
        db_connection.query(`
        select 
            product_uid, uid 
        from tbl_video 
        where is_deleted = 0 
            and is_authorize=1`, (err, rows, fields)=>{

                if(err){
                    console.loc(1111)
                    reject(err)
                }else{
                    resolve(rows)
                }
        })
                


    })
}

async function queryCheck(item, db_connection) {
    return await new Promise(async(resolve, reject)=>{
        db_connection.query(`
        select 
            * 
        from tbl_video_product 
        where product_uid = ${item.product_uid} 
            and video_uid = ${item.uid}`, (err, rows, fields)=>{

                if(err){
                    console.log(1313)
                    reject(err)
                }else{
                    resolve(rows[0])
                }
        })
    })
}

async function queryInsert(item, db_connection) {
    return await new Promise(async(resolve, reject)=>{
        db_connection.query(`
            insert into tbl_video_product
            set product_uid = ${item.product_uid}
            , video_uid = ${item.uid}
        `, (err, rows, fields)=>{

                if(err){
                    console.log(1515)
                    reject(err)
                }else{

                    resolve(rows)
                }
        })
    })
}