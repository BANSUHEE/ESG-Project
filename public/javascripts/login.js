$(document).ready(function () {
    const loginForm = $("#loginForm");

    if (loginForm.length) {
        loginForm.on("submit", function (e) {
            e.preventDefault(); // 폼의 기본 제출 동작을 방지

            // 사용자 입력 정보
            const username = $("#username").val();
            const password = $("#password").val();

            // 로그인 요청을 서버로 전송
            $.ajax({
                url: "/users/login",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    username: username,
                    password: password,
                }),
                success: function (data) {
                    if (data.success) {
                        $("#loginResult").text("Login successful!");
                        alert("로그인 성공");
                        sessionStorage.setItem("username", username);
                        window.location.href = "/"; // 성공 시 홈 페이지로 리다이렉트
                    } else {
                        $("#loginResult").text("Invalid credentials.");
                        alert("로그인 실패: 잘못된 자격 증명");
                    }
                },
                error: function (xhr) {
                    const errorMessage =
                        xhr.responseJSON?.message ||
                        "Network response was not ok";
                    console.error("로그인 요청 중 오류 발생:", errorMessage);
                    $("#loginResult").text(`Error: ${errorMessage}`);
                },
            });
        });
    } else {
        console.error("ID가 'loginForm'인 요소를 찾을 수 없습니다.");
    }
});
