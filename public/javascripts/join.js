$(document).ready(function () {
    const joinForm = $("#joinForm");

    if (joinForm.length) {
        joinForm.on("submit", function (e) {
            e.preventDefault(); // 폼의 기본 제출 동작을 방지

            // 입력 데이터 캡처
            const name = $("#name").val();
            const username = $("#username").val();
            const password = $("#password").val();
            const business_type = $("#business_type").val();
            const registration_number = $("#registration_number").val();

            // 서버로 데이터 전송
            $.ajax({
                url: "/users/join",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    name: name,
                    username: username,
                    password: password,
                    business_type: business_type,
                    registration_number: registration_number,
                }),
                success: function (data) {
                    if (data.success) {
                        $("#joinResult").text("Signup successful!");
                        console.log("회원가입 성공");
                    } else {
                        $("#joinResult").text(
                            "Signup failed: " +
                                (data.message || "Unknown error")
                        );
                        console.log("회원가입 실패");
                    }
                },
                error: function (xhr) {
                    const errorMessage =
                        xhr.responseJSON?.message ||
                        "Network response was not ok";
                    console.error("회원가입 요청 중 오류 발생:", errorMessage);
                    $("#joinResult").text(`Error: ${errorMessage}`);
                },
            });
        });
    } else {
        console.error("ID가 'joinForm'인 요소를 찾을 수 없습니다.");
    }
});
