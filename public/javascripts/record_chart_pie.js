let co2PieChart = null;

// 서버에서 데이터 가져와 차트 업데이트
export function fetchAndUpdateChartPie(selectedMonth, selectedYear) {
    fetch(
        `/stats/chart_pie?selectedMonth=${selectedMonth}&selectedYear=${selectedYear}`
    )
        .then((response) => {
            if (!response.ok) {
                throw new Error(
                    "선택된 월과 연도의 데이터를 가져올 수 없습니다."
                );
            }
            return response.json();
        })
        .then((data) => {
            updateChartPie(data);
        })
        .catch((error) => {
            console.error("데이터를 가져오는 중 오류 발생:", error);
        });
}

// 차트 업데이트
function updateChartPie(data) {
    const co2Values = [
        data.electricity_co2,
        data.gas_co2,
        data.water_co2,
        data.transport_co2,
        data.waste_co2,
    ];

    const labels = ["전기", "가스", "수도", "교통", "쓰레기"];

    // 이전 차트 제거
    if (co2PieChart) {
        co2PieChart.destroy();
    }

    const ctx = document.getElementById("co2Chart_pie").getContext("2d");
    co2PieChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "CO₂ 배출 비율",
                    data: co2Values,
                    backgroundColor: [
                        "rgba(255, 99, 132, 0.2)",
                        "rgba(54, 162, 235, 0.2)",
                        "rgba(255, 206, 86, 0.2)",
                        "rgba(75, 192, 192, 0.2)",
                        "rgba(153, 102, 255, 0.2)",
                    ],
                    borderColor: [
                        "rgba(255, 99, 132, 1)",
                        "rgba(54, 162, 235, 1)",
                        "rgba(255, 206, 86, 1)",
                        "rgba(75, 192, 192, 1)",
                        "rgba(153, 102, 255, 1)",
                    ],
                    borderWidth: 1,
                },
            ],
        },

        options: {
            responsive: true,
            plugins: {
                datalabels: {
                    color: "gray", // 글자 색상
                    formatter: (value, ctx) => {
                        const total = ctx.dataset.data.reduce(
                            (acc, cur) => acc + cur,
                            0
                        );
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${
                            ctx.chart.data.labels[ctx.dataIndex]
                        }\n(${percentage}%)`;
                    },
                    anchor: (context) => {
                        const percentage = calculatePercentage(context);
                        return percentage > 15 ? "center" : "end"; // 큰 섹션은 내부에 표시
                    },
                    align: (context) => {
                        const percentage = calculatePercentage(context);
                        return percentage > 15 ? "center" : "start"; // 작은 섹션은 바깥에 표시
                    },
                    offset: (context) => {
                        const percentage = calculatePercentage(context);
                        return percentage < 10 ? 0 : 20; // 작은 섹션은 바깥으로 이동
                    },
                    font: {
                        size: 20,
                        weight: "bold",
                    },
                },
            },
        },
        plugins: [ChartDataLabels],
    });
    // 비율 계산 함수
    function calculatePercentage(context) {
        const value = context.dataset.data[context.dataIndex];
        const total = context.dataset.data.reduce((acc, cur) => acc + cur, 0);
        return ((value / total) * 100).toFixed(1);
    }
}

// // 연도와 월 선택 이벤트 설정
// document
//     .getElementById("yearSelect")
//     .addEventListener("change", updateChartBySelection);
// document.querySelectorAll(".month-selector input").forEach((checkbox) => {
//     checkbox.addEventListener("change", (e) => {
//         document.querySelectorAll(".month-selector input").forEach((cb) => {
//             if (cb !== e.target) cb.checked = false;
//         });
//         updateChartBySelection();
//     });
// });

// // 연도 및 월 선택 시 차트 업데이트
// function updateChartBySelection() {
//     const selectedYear = document.getElementById("yearSelect").value;
//     const selectedMonth = document.querySelector(
//         ".month-selector input:checked"
//     )?.value;
//     if (selectedYear && selectedMonth) {
//         fetchAndUpdateChartPie(selectedMonth, selectedYear);
//     }
// }

// // 초기 데이터 로드
// document.addEventListener("DOMContentLoaded", () => {
//     const currentMonth = new Date().getMonth() + 1; // 현재 월
//     const currentYear = new Date().getFullYear(); // 현재 연도

//     document.getElementById("yearSelect").value = currentYear;
//     document.querySelector(
//         `.month-selector input[value="${currentMonth}"]`
//     ).checked = true;

//     fetchAndUpdateChartPie(currentMonth, currentYear);
// });
