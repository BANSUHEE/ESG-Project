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

router.get("/record", (req, res) => {
    res.render("index", {
        title: "record",
        pageName: "stats/record.ejs",
    });
});

// 데이터를 가져오는 경로 설정
router.get("/chart_bar", (req, res) => {
    const username = req.session.username; // 세션에서 username 가져오기

    if (!username) {
        return res.status(401).send("사용자가 로그인되어 있지 않습니다.");
    }

    // const sql = `
    //     SELECT year, month, total_co2
    //     FROM emissions
    //     WHERE username = ?
    //     ORDER BY year DESC, month DESC
    //     LIMIT 6;
    // `;
    const sql = `SELECT
        m.year,
        m.month,
        COALESCE(e.total_co2, 0) AS total_co2
        FROM (
            SELECT
                YEAR(DATE_ADD(CURDATE(), INTERVAL -5 MONTH)) AS year,
                MONTH(DATE_ADD(CURDATE(), INTERVAL -5 MONTH)) AS month
            UNION ALL
            SELECT
                YEAR(DATE_ADD(CURDATE(), INTERVAL -4 MONTH)),
                MONTH(DATE_ADD(CURDATE(), INTERVAL -4 MONTH))
            UNION ALL
            SELECT
                YEAR(DATE_ADD(CURDATE(), INTERVAL -3 MONTH)),
                MONTH(DATE_ADD(CURDATE(), INTERVAL -3 MONTH))
            UNION ALL
            SELECT
                YEAR(DATE_ADD(CURDATE(), INTERVAL -2 MONTH)),
                MONTH(DATE_ADD(CURDATE(), INTERVAL -2 MONTH))
            UNION ALL
            SELECT
                YEAR(DATE_ADD(CURDATE(), INTERVAL -1 MONTH)),
                MONTH(DATE_ADD(CURDATE(), INTERVAL -1 MONTH))
            UNION ALL
            SELECT
                YEAR(CURDATE()) AS year,
                MONTH(CURDATE()) AS month
        ) m
        LEFT JOIN emissions e
            ON m.year = e.year AND m.month = e.month AND e.username = ?
        ORDER BY m.month DESC; -- 과거부터 정렬`;

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

router.get("/chart_pie", (req, res) => {
    const username = req.session.username;

    if (!username) {
        return res.status(401).send("사용자가 로그인되어 있지 않습니다.");
    }

    const sql = `
        SELECT 
            electricity_co2,
            gas_co2,
            water_co2,
            transport_co2,
            waste_co2
        FROM emissions
        WHERE username = ? AND year = YEAR(CURDATE()) AND month = MONTH(CURDATE());
    `;

    connection.query(sql, [username], (err, results) => {
        if (err) {
            console.error("데이터 조회 오류:", err);
            res.status(500).send("데이터 조회 중 오류가 발생했습니다.");
        } else if (results.length === 0) {
            res.status(404).send("현재 월 데이터가 없습니다.");
        } else {
            res.json(results[0]); // 첫 번째 결과만 반환
        }
    });
});

module.exports = router;
