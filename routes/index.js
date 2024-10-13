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
module.exports = router;
