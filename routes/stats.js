var express = require("express");
var router = express.Router();
const connection = require("./database");

router.get("/calculator", function (req, res, next) {
    //랜더링한다.(출력) => view파일의 ejs 파일을(기본적으로 html+서버에서 보낸 변수 처리 가능)
    res.render("index", {
        title: "calculator",
        pageName: "stats/calculator.ejs",
    });
});

// router.get("/chart", function (req, res, next) {
//     // http://localhost/chart // app.js 에 경로 있음
//     // 서버에서 변수 설정 하고 클라이언트로 보냄
//     var data1 = 10;
//     var data2 = 20;
//     var data3 = 30;

//     // 데이터를 ejs로 전달
//     res.render("index", {
//         title: "Chart",
//         pageName: "stats/chart.ejs",
//         data1: data1,
//         data2: data2,
//         data3: data3,
//     });
// });

router.post("/calculator", (req, res) => {
    const {
        username,
        year,
        month,
        electricity_co2,
        gas_co2,
        water_co2,
        transport_co2,
        waste_co2,
        total_co2,
    } = req.body;

    const sql = `
    INSERT INTO emissions (username, year, month, electricity_co2, gas_co2, water_co2, transport_co2, waste_co2, total_co2)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        electricity_co2 = VALUES(electricity_co2),
        gas_co2 = VALUES(gas_co2),
        water_co2 = VALUES(water_co2),
        transport_co2 = VALUES(transport_co2),
        waste_co2 = VALUES(waste_co2),
        total_co2 = VALUES(total_co2)`;

    const values = [
        username,
        year,
        month,
        electricity_co2,
        gas_co2,
        water_co2,
        transport_co2,
        waste_co2,
        total_co2,
    ];
    // db.query 오류
    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error("데이터 삽입 오류:", err);
            res.status(500).send("데이터 저장 중 오류가 발생했습니다.");
        } else {
            res.send("데이터가 성공적으로 저장되었습니다.");
        }
    });
});
router.get("/chart", (req, res) => {
    const username = req.session.username; // 세션에서 username 가져오기

    if (!username) {
        return res.status(401).send("사용자가 로그인되어 있지 않습니다.");
    }

    const sql = `
        SELECT year, month, total_co2
        FROM emissions
        WHERE username = ?
        ORDER BY year DESC, month DESC
        LIMIT 6;
    `;

    connection.query(sql, [username], (err, results) => {
        if (err) {
            console.error("데이터 조회 오류:", err);
            res.status(500).send("데이터 조회 중 오류가 발생했습니다.");
        } else {
            results.reverse(); // 최신 데이터를 과거 순서로 정렬
            res.json(results); // 데이터를 JSON으로 클라이언트에 응답
        }
    });
});

module.exports = router;
