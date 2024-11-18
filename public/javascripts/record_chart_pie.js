fetch(`/stats/chart_pie`)
    .then((response) => {
        if (!response.ok) {
            throw new Error("현재 월 데이터를 가져올 수 없습니다.");
        }
        return response.json();
    })
    .then((data) => {
        console.log(data);

        // 데이터를 배열로 변환
        const co2Values = [
            data.electricity_co2,
            data.gas_co2,
            data.water_co2,
            data.transport_co2,
            data.waste_co2,
        ];

        // 데이터 레이블 설정
        const labels = [
            "Electricity CO₂",
            "Gas CO₂",
            "Water CO₂",
            "Transport CO₂",
            "Waste CO₂",
        ];

        // Chart.js로 원형 차트 생성
        const ctx = document.getElementById("co2Chart_pie").getContext("2d");
        const pieChart = new Chart(ctx, {
            type: "pie", // 원형 차트
            data: {
                labels: labels, // 각 항목 이름
                datasets: [
                    {
                        label: "CO₂ 배출 비율",
                        data: co2Values, // 각 항목의 값
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
                    tooltip: {
                        callbacks: {
                            label: (tooltipItem) => {
                                const value = tooltipItem.raw;
                                const total = co2Values.reduce(
                                    (a, b) => a + b,
                                    0
                                );
                                const percentage = (
                                    (value / total) *
                                    100
                                ).toFixed(2);
                                return `${tooltipItem.label}: ${value}kg (${percentage}%)`;
                            },
                        },
                    },
                },
            },
        });
    })
    .catch((error) => {
        console.error("데이터를 가져오는 중 오류 발생:", error);
    });
