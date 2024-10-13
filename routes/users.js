var express = require("express");
var router = express.Router();
const mysql = require("mysql");

/* GET users listing. */
router.get("/", function (req, res, next) {
    res.send("respond with a resource");
});

// MySQL 연결 설정
const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "root",
    database: "companydb",
});

connection.connect((err) => {
    if (err) {
        console.error("MySQL 연결 오류:", err);
        return;
    }
    console.log("MySQL에 연결되었습니다.");
});

//---------------------[로그인]------------------------//
// GET 요청 시 로그인 페이지 렌더링
router.get("/login", function (req, res, next) {
    res.render("index", {
        title: "로그인",
        pageName: "users/login.ejs",
    });
});

// POST 요청 시 로그인 처리
router.post("/login", function (req, res, next) {
    const { username, password } = req.body;

    const query = "SELECT * FROM companies WHERE username = ? AND password = ?";
    connection.query(query, [username, password], (error, results) => {
        if (error) {
            console.error("MySQL 쿼리 오류:", error);
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: error.message,
            });
        }

        if (results.length > 0) {
            res.json({ success: true });
            console.log("로그인 성공");
        } else {
            res.json({ success: false });
            console.log("로그인 실패: 잘못된 자격 증명");
        }
    });
});

//---------------------[회원가입]------------------------//
// router.get("/join", function (req, res, next) {
//     res.render("users/join", { title: "join", pageName: "join.ejs" });
// });
router.get("/join", function (req, res, next) {
    res.render("index", {
        title: "회원가입",
        pageName: "users/join.ejs",
    });
});
router.post("/join", (req, res) => {
    const { name, username, password, business_type, registration_number } =
        req.body;

    const sql =
        "INSERT INTO companies (name, username, password, business_type, registration_number) VALUES (?, ?, ?, ?, ?)";
    connection.query(
        sql,
        [name, username, password, business_type, registration_number],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                res.status(500).json({
                    success: false,
                    message: "Database error",
                });
            } else {
                res.json({
                    success: true,
                    message: "User registered successfully",
                });
            }
        }
    );
});

//---------------------[온실가스 계산기]------------------------//

module.exports = router;
