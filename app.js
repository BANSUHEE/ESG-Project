var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var statsRouter = require("./routes/stats");
const apiRouter = require('./routes/api');


var app = express();

//session
const session = require("express-session");

app.use(
    session({
        secret: "your-secret-key", // 강력한 비밀 키를 사용하세요
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // HTTPS 사용 시 true로 설정
    })
);

app.use((req, res, next) => {
    res.locals.username = req.session.username || null; // 모든 뷰에서 username 접근 가능
    next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/stats", statsRouter);
app.use('/api', apiRouter);
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
