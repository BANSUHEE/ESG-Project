var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    //랜더링한다.(출력) => view파일의 ejs 파일을(기본적으로 html+서버에서 보낸 변수 처리 가능)
    res.render("index", { title: "ESC", pageName: "home.ejs" });
});

router.get("/calculator", function (req, res, next) {
    //랜더링한다.(출력) => view파일의 ejs 파일을(기본적으로 html+서버에서 보낸 변수 처리 가능)
    res.render("index", { title: "calculator", pageName: "calculator.ejs" });
});

router.get("/chart", function (req, res, next) {
    // http://localhost/chart // app.js 에 경로 있음
    // 서버에서 변수 설정 하고 클라이언트로 보냄
    var data1 = 10;
    var data2 = 20;
    var data3 = 30;

    // 데이터를 ejs로 전달
    res.render("index", {
        title: "Chart",
        pageName: "chart.ejs",
        data1: data1,
        data2: data2,
        data3: data3,
    });
});

module.exports = router;
