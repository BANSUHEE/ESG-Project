document.addEventListener("DOMContentLoaded", function () {
    const joinForm = document.getElementById("joinForm");

    if (joinForm) {
        joinForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Prevent the form's default submission behavior

            // Capture input data
            const name = document.getElementById("name").value;
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
            const business_type =
                document.getElementById("business_type").value;
            const registration_number = document.getElementById(
                "registration_number"
            ).value;

            // Send data to the server
            fetch("/users/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: name,
                    username: username,
                    password: password,
                    business_type: business_type,
                    registration_number: registration_number,
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
                        document.getElementById("joinResult").innerText =
                            "Signup successful!";
                        console.log("회원가입 성공");
                    } else {
                        document.getElementById("joinResult").innerText =
                            "Signup failed: " +
                            (data.message || "Unknown error");
                        console.log("회원가입 실패");
                    }
                })
                .catch((error) => {
                    console.error("회원가입 요청 중 오류 발생:", error.message);
                    document.getElementById(
                        "joinResult"
                    ).innerText = `Error: ${error.message}`;
                });
        });
    } else {
        console.error("ID가 'joinForm'인 요소를 찾을 수 없습니다.");
    }
});
