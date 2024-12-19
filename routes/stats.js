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
    const selectedMonth = parseInt(req.query.selectedMonth); // 선택된 월 가져오기
    const selectedYear = parseInt(req.query.selectedYear); // 선택된 연도 가져오기

    if (!username) {
        return res.status(401).send("사용자가 로그인되어 있지 않습니다.");
    }
    if (!selectedMonth || selectedMonth < 1 || selectedMonth > 12) {
        return res.status(400).send("유효한 월이 선택되지 않았습니다.");
    }
    if (!selectedYear || selectedYear < 1900 || selectedYear > 2100) {
        return res.status(400).send("유효한 연도가 선택되지 않았습니다.");
    }

    const sql = `
        SELECT
            YEAR(DATE_ADD(CONCAT(?, '-', ?, '-01'), INTERVAL -seq MONTH)) AS year,
            MONTH(DATE_ADD(CONCAT(?, '-', ?, '-01'), INTERVAL -seq MONTH)) AS month,
            COALESCE(e.total_co2, 0) AS total_co2
        FROM (
            SELECT 0 AS seq UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL
            SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
        ) AS months
        LEFT JOIN emissions e
            ON YEAR(DATE_ADD(CONCAT(?, '-', ?, '-01'), INTERVAL -months.seq MONTH)) = e.year
            AND MONTH(DATE_ADD(CONCAT(?, '-', ?, '-01'), INTERVAL -months.seq MONTH)) = e.month
            AND e.username = ?
        ORDER BY year ASC, month ASC;
    `;

    connection.query(
        sql,
        [
            selectedYear,
            selectedMonth,
            selectedYear,
            selectedMonth,
            selectedYear,
            selectedMonth,
            selectedYear,
            selectedMonth,
            username,
        ],
        (err, results) => {
            if (err) {
                console.error("데이터 조회 오류:", err);
                res.status(500).send("데이터 조회 중 오류가 발생했습니다.");
            } else {
                res.json(results);
            }
        }
    );
});
router.get("/chart_pie", (req, res) => {
    const username = req.session.username;
    const selectedMonth = parseInt(req.query.selectedMonth); // 선택된 월 가져오기
    const selectedYear = parseInt(req.query.selectedYear); // 선택된 연도 가져오기

    if (!username) {
        return res.status(401).send("사용자가 로그인되어 있지 않습니다.");
    }
    if (!selectedMonth || selectedMonth < 1 || selectedMonth > 12) {
        return res.status(400).send("유효한 월이 선택되지 않았습니다.");
    }
    if (!selectedYear || selectedYear < 1900 || selectedYear > 2100) {
        return res.status(400).send("유효한 연도가 선택되지 않았습니다.");
    }

    const sql = `
        SELECT 
            COALESCE(electricity_co2, 0) AS electricity_co2,
            COALESCE(gas_co2, 0) AS gas_co2,
            COALESCE(water_co2, 0) AS water_co2,
            COALESCE(transport_co2, 0) AS transport_co2,
            COALESCE(waste_co2, 0) AS waste_co2
        FROM emissions
        WHERE username = ? AND year = ? AND month = ?;
    `;

    connection.query(
        sql,
        [username, selectedYear, selectedMonth],
        (err, results) => {
            if (err) {
                console.error("데이터 조회 오류:", err);
                res.status(500).send("데이터 조회 중 오류가 발생했습니다.");
            } else if (results.length === 0) {
                res.status(404).send("선택된 월과 연도의 데이터가 없습니다.");
            } else {
                res.json(results[0]); // 첫 번째 결과 반환
            }
        }
    );
});

router.get("/yearly-emissions", (req, res) => {
    const username = req.session.username; // 세션에서 username 가져오기
    const selectedYear = parseInt(req.query.selectedYear); // 선택된 연도 가져오기

    if (!username) {
        return res.status(401).send("사용자가 로그인되어 있지 않습니다.");
    }
    if (!selectedYear || selectedYear < 1900 || selectedYear > 2100) {
        return res.status(400).send("유효한 연도가 선택되지 않았습니다.");
    }

    const sql = `
        SELECT month, COALESCE(total_co2, 0) AS total_co2
        FROM emissions
        WHERE username = ? AND year = ?
        ORDER BY month ASC;
    `;

    connection.query(sql, [username, selectedYear], (err, results) => {
        if (err) {
            console.error("연도별 데이터 조회 오류:", err);
            return res.status(500).send("데이터 조회 중 오류가 발생했습니다.");
        }

        res.json(results); // 연도의 모든 월 데이터를 JSON 형식으로 반환
    });
});

router.post("/call", async (req, res) => {
    try {
        console.log("요청 본문:", req.body); // 요청 본문 로깅

        const apiURL =
            "https://www.bigdata-environment.kr/user/openapi/api.call.do";

        const response = await axios.post(apiURL, req.body, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            responseType: "text", // 응답을 텍스트로 받기
        });

        console.log("API 응답:", response.data);
        res.send(response.data);
    } catch (error) {
        console.error(
            "API 호출 중 오류:",
            error.response ? error.response.data : error.message
        );
        res.status(500).send(error.message);
    }
});

/* api호출 page. */
router.get("/api", function (req, res) {
    res.render("index", { title: "API 호출", pageName: "stats/api.ejs" });
});

module.exports = router;
