let co2Chart = null;

// 서버에서 데이터 가져와 차트 업데이트
export function fetchAndUpdateChartBar(selectedMonth, selectedYear) {
    fetch(
        `/stats/chart_bar?selectedMonth=${selectedMonth}&selectedYear=${selectedYear}`
    )
        .then((response) => response.json())
        .then((data) => {
            updateChartBar(data);
        })
        .catch((error) => {
            console.error("데이터를 가져오는 중 오류 발생:", error);
        });
}

function updateChartBar(data) {
    const labels = data.map(
        (item) => `${item.year}-${String(item.month).padStart(2, "0")}`
    );
    const co2Data = data.map((item) => item.total_co2);

    // 이전 차트 제거
    if (co2Chart) {
        co2Chart.destroy();
    }

    const ctx = document.getElementById("co2Chart_bar").getContext("2d");
    co2Chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "CO₂ 배출량 추세", // 라인 그래프 데이터셋
                    data: co2Data,
                    borderColor: "rgba(140, 140, 255)",
                    backgroundColor: "rgba(140, 140, 255, 0.2)",
                    borderWidth: 2,
                    type: "line",
                    datalabels: {
                        display: false, // 레이블 표시X
                    },
                },
                {
                    label: "CO₂ 배출량",
                    data: co2Data,
                    backgroundColor: "rgba(75, 192, 192, 0.5)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                    borderRadius: 5,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "CO₂ 배출량 (kg)", // y축 제목
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: "년월", // x축 제목
                    },
                },
            },
        },
    });
}

// // 연도 선택 이벤트 리스너
// document.getElementById("yearSelect").addEventListener("change", () => {
//     const selectedYear = document.getElementById("yearSelect").value;
//     const selectedMonth =
//         document.querySelector(".month-selector input:checked")?.value ||
//         new Date().getMonth() + 1;

//     fetchAndUpdateChartBar(selectedMonth, selectedYear);
// });

// // 단일 선택 체크박스 이벤트 설정
// document.querySelectorAll(".month-selector input").forEach((checkbox) => {
//     checkbox.addEventListener("change", (e) => {
//         // 다른 체크박스 해제
//         document.querySelectorAll(".month-selector input").forEach((cb) => {
//             if (cb !== e.target) cb.checked = false;
//         });

//         // 선택된 월과 드롭다운의 연도 가져오기
//         const selectedMonth = parseInt(e.target.value);
//         const selectedYear = document.getElementById("yearSelect").value;

//         fetchAndUpdateChartBar(selectedMonth, selectedYear);
//     });
// });

// // 초기 설정 - 현재 연도와 월 기준 데이터 로드S
// document.addEventListener("DOMContentLoaded", () => {
//     const currentMonth = new Date().getMonth() + 1; // 현재 월
//     const currentYear = new Date().getFullYear(); // 현재 연도

//     // 초기값 설정
//     document.getElementById("yearSelect").value = currentYear;
//     document.querySelector(
//         `.month-selector input[value="${currentMonth}"]`
//     ).checked = true;

//     fetchAndUpdateChartBar(currentMonth, currentYear);
// });
