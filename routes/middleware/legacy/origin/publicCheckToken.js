const paramUtil = require("../../../../common/utils/legacy/origin/paramUtil");
const fileUtil = require("../../../../common/utils/legacy/origin/fileUtil");
const mysqlUtil = require("../../../../common/utils/legacy/origin/mysqlUtil");
const sendUtil = require("../../../../common/utils/legacy/origin/sendUtil");
const errUtil = require("../../../../common/utils/legacy/origin/errUtil");
const logUtil = require("../../../../common/utils/legacy/origin/logUtil");
const jwtUtil = require("../../../../common/utils/legacy/origin/jwtUtil");

const errCode = require("../../../../common/define/errCode");

let file_name = fileUtil.name(__filename);

module.exports = function (req, res, next) {
  const _funcName = arguments.callee.name;

  try {
    req.file_name = file_name;
    // logUtil.printUrlLog(req, `== function start ==================================`);
    // console.log(`===>>> headers: ${JSON.stringify(req.headers)}`);
    // req.paramBody = paramUtil.parse(req);
    // logUtil.printUrlLog(req, `param: ${JSON.stringify(req.paramBody)}`);

    checkParam(req);

    mysqlUtil.connectPool(
      async function (db_connection) {
        req.innerBody = {};
        if (req.headers["user_uid"] > 0) {
          req.innerBody["item"] = await querySelect(req, db_connection);
          if (!req.innerBody.item["uid"]) {
            req.headers["user_uid"] = 0;
          }
        }

        next();
      },
      function (err) {
        return sendUtil.sendAuthErrorPacket(req, res, err);
      }
    );
  } catch (e) {
    let _err = errUtil.get(e);
    return sendUtil.sendAuthErrorPacket(req, res, _err);
  }
};

function checkParam(req) {
  if (!paramUtil.checkParam_return(req.headers, "access_token")) {
    errUtil.createCall(
      errCode.auth,
      `접속 토큰이 존재하지 않습니다. 다시 로그인해 주세요.`
    );
  }

  let token = req.headers["access_token"];
  try {
    //jwt 인증
    let data = jwtUtil.getPayload(token);
    req.headers["user_uid"] = data["uid"];
  } catch (ex) {
    console.log(ex, "===============>>>>>>>>토큰 에러 확인");
    //세션이 만료되거나 인증이 되지 않으면 에러를 발생시켜서 에러를 catch
    errUtil.createCall(
      errCode.auth,
      `접속 토큰이 유효하지 않습니다. msg : ${ex.message}`
    );
  }
}

function querySelect(req, db_connection) {
  const _funcName = arguments.callee.name;

  return mysqlUtil.querySingle(
    db_connection,
    "call proc_select_user_access_token_check_v2",
    [req.headers["user_uid"]]
  );
}
