var express = require("express");
var router = express.Router();
const mysql = require("mysql");

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
module.exports = connection;
