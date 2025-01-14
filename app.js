const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const funcUtil = require("./common/utils/legacy/origin/funcUtil");
const sendUtil = require("./common/utils/legacy/origin/sendUtil");
const errUtil = require("./common/utils/legacy/origin/errUtil");
const errCode = require("./common/define/errCode");
require("dotenv").config();
const authController = require("./routes/api/legacy/origin/auth/createPublicToken");

const indexRouter = require("./routes/index");
// const usersRouter = require('./routes/users');

const app = express();

//컨플릭 해결 완료
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECURE_KEY));
app.use(express.static(path.join(__dirname, "public")));

if (!funcUtil.isRealServer) {
  app.use("/api-docs", require("./apiDocs/swaggerDocs"));
}
app.get("/api/public/auth/token", authController.createToken); // 비로그인 때 추가함 22. 10. 20
// app.all('/api/callback/bootpay', require('./routes/callback/createBootpay'))
app
  .route("/api/callback/bootpay")
  .post(require("./routes/callback/createBootpay"));
app.route("/api/callback/greenp").get(require("./routes/callback/getGreenp"));

// app.all('/api/public/*', require('./routes/middleware/setHeader')); // 비로그인 때 주석함 22. 10. 20
// app.all('/api/private/*', require('./routes/middleware/setHeader')); // 비로그인 때 주석함 22. 10. 20

app.all(
  "/api/version/check",
  require("./routes/api/legacy/origin/appCheck/selectAppCheck")
); //api 버전 체크 url
app.all(
  "/api/private/*",
  require("./routes/middleware/legacy/origin/checkAccessToken")
);
app.all(
  "/api/public/*",
  require("./routes/middleware/legacy/origin/publicCheckToken")
);

app.use("/api/private", require("./routes/api/api_private"));
app.use("/api/public", require("./routes/api/api_public"));
app.use("/others", require("./routes/page/page_router"));

app.use("/", indexRouter);
// app.use('/users', usersRouter) ;

require("./routes/cron/legacy/origin/cronUpdateOrderStatus").start();
require("./routes/cron/legacy/origin/cronUpdateExpirationGift").start();
require("./routes/cron/legacy/origin/cronSendFcmExpirationGift").start();
require("./routes/cron/legacy/v1/v1CronExtentionGonguEndTime").start();
require("./routes/cron/legacy/v1/v1CronCancelGonguUser").start();

app.use(function (req, res, next) {
  // console.log('====== path error req.originalUrl : '+req.originalUrl);
  // console.log('====== path error req.originalUrl.indexOf(\'/api\') : '+req.originalUrl.indexOf('/api'));
  console.log("===== req.baseUrl : " + req.baseUrl);
  console.log("===== req.originalUrl : " + req.originalUrl);
  console.log(
    "===== req.originalUrl.indexOf : " + req.originalUrl.indexOf("/api")
  );
  if (req.originalUrl.indexOf("/api") === 0) {
    sendUtil.sendErrorPacket(
      req,
      res,
      errUtil.initError(
        errCode.path,
        `존재 하지 않는 url 경로 입니다. 요청 url: ${req.originalUrl}`
      )
    );
  } else {
    next();
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
