fetch(`/stats/chart_bar`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data); // 데이터를 콘솔에 출력하여 확인

        if (data.length === 0) {
            alert("해당 사용자의 데이터가 없습니다.");
            return;
        }

        // 데이터를 labels와 co2Data로 분리하여 차트에 사용
        const labels = data.map(
            (item) => `${item.year}-${String(item.month).padStart(2, "0")}`
        );
        const co2Data = data.map((item) => item.total_co2);

        // Chart.js를 사용하여 차트 생성
        const ctx = document.getElementById("co2Chart_bar").getContext("2d");
        const gradient = ctx.createLinearGradient(0, 0, 0, 400); // 위에서 아래로
        gradient.addColorStop(0, "rgba(75, 192, 192, 1)"); // 시작 색상
        gradient.addColorStop(1, "rgba(190, 220, 200, 0.5)"); // 끝 색상

        const co2Chart = new Chart(ctx, {
            type: "bar", // 기본 차트 유형: 막대
            data: {
                labels: labels, // x축 라벨
                datasets: [
                    {
                        label: "CO₂ 배출량 추세", // 라인 그래프 데이터셋
                        data: co2Data,
                        borderColor: "rgba(140, 140, 255)",
                        backgroundColor: "rgba(140, 140, 255, 0.2)",
                        borderWidth: 2,
                        type: "line",
                        yAxisID: "y", // y축 ID
                        datalabels: {
                            display: false, // 레이블 표시X
                        },
                    },
                    {
                        label: "총 CO₂ 배출량 (kg)", // 막대 그래프 데이터셋
                        data: co2Data,
                        backgroundColor: gradient,
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                        type: "bar",
                        yAxisID: "y", // y축 ID
                        datalabels: {
                            anchor: "end", // 데이터 레이블 위치
                            align: "top", // 데이터 레이블 정렬
                            formatter: (value) => value.toLocaleString(), // 값 표시 형식
                            font: {
                                size: 17,
                                weight: "bold",
                            },
                        },
                    },
                ],
            },
            options: {
                responsive: true, // 반응형 차트
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
                            text: "월", // x축 제목
                        },
                    },
                },
            },
            plugins: [ChartDataLabels], // 데이터 레이블 플러그인 추가
        });
    })
    .catch((error) => {
        console.error("데이터를 가져오는 중 오류 발생:", error);
    });
