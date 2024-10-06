// express 불러오기
const express = require("express");
//session 불러오기
const session = require("express-session");
const path = require("path");
// express 인스턴스 생성
const app = express();
// 포트 정보
const port = 3000;

// 세션 설정
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPS 환경에서는 true로 설정해야 함
  })
);

// 정적 파일 제공 (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// POST 요청 처리용 미들웨어
app.use(express.urlencoded({ extended: true }));

// 간단한 유저 데이터 (아이디, 비밀번호)
const users = {
  user1: "password1",
  user2: "password2",
};

// 로그인 라우트
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (users[username] && users[username] === password) {
    req.session.user = username;
    return res.redirect("/home");
  }

  return res.redirect("/?error=Invalid credentials");
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error logging out.");
    }
    res.redirect("/");
  });
});

// 로그인 후 보여줄 페이지
app.get("/home", (req, res) => {
  if (req.session.user) {
    return res.sendFile(path.join(__dirname, "public", "home.html"));
  }
  return res.redirect("/");
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// // 라우트 설정
// // HTTP GET 방식으로 '/' 경로를 요청하였을 때
// // Hello World!라는 문자열을 결과값으로 보냄
// app.get('/', (req, res) => {
//   res.send('Hello World!');
// });
// // API 라우트 설정
// app.get('/api/message', (req, res) => {
//   res.json({ message: 'Hello from the Node.js backend!' });
// });

// // 서버 실행
// app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });
