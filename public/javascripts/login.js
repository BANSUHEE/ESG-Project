document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault(); // 폼의 기본 제출 동작을 방지

            // 사용자 입력 정보
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;

            // 로그인 요청을 서버로 전송
            fetch("/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        return response.json().then((err) => {
                            throw new Error(
                                err.message || "Network response was not ok"
                            );
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.success) {
                        document.getElementById("loginResult").innerText =
                            "Login successful!";
                        console.log("로그인 성공");
                    } else {
                        document.getElementById("loginResult").innerText =
                            "Invalid credentials.";
                        console.log("로그인 실패: 잘못된 자격 증명");
                    }
                })
                .catch((error) => {
                    console.error("로그인 요청 중 오류 발생:", error.message);
                    document.getElementById(
                        "loginResult"
                    ).innerText = `Error: ${error.message}`;
                });
        });
    } else {
        console.error("ID가 'loginForm'인 요소를 찾을 수 없습니다.");
    }
});
