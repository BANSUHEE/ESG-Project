
// fetch(`/stats/chart_bar`)
//     .then((response) => response.json())
//     .then((data) => {
//         console.log(data); // 데이터를 콘솔에 출력하여 확인

//         if (data.length === 0) {
//             alert("해당 사용자의 데이터가 없습니다.");
//             return;
//         }

//         // 데이터를 labels와 co2Data로 분리하여 차트에 사용
//         const labels = data.map(
//             (item) => `${item.year}-${String(item.month).padStart(2, "0")}`
//         );
//         const co2Data = data.map((item) => item.total_co2);

//         // Chart.js를 사용하여 차트 생성
//         const ctx = document.getElementById("co2Chart_bar").getContext("2d");
//         const gradient = ctx.createLinearGradient(0, 0, 0, 400); // 위에서 아래로
//         gradient.addColorStop(0, "rgba(75, 192, 192, 1)"); // 시작 색상
//         gradient.addColorStop(1, "rgba(190, 220, 200, 0.5)"); // 끝 색상

//         const co2Chart = new Chart(ctx, {
//             type: "bar", // 기본 차트 유형: 막대
//             data: {
//                 labels: labels, // x축 라벨
//                 datasets: [
//                     {
//                         label: "CO₂ 배출량 추세", // 라인 그래프 데이터셋
//                         data: co2Data,
//                         borderColor: "rgba(140, 140, 255)",
//                         backgroundColor: "rgba(140, 140, 255, 0.2)",
//                         borderWidth: 2,
//                         type: "line",
//                         yAxisID: "y", // y축 ID
//                         datalabels: {
//                             display: false, // 레이블 표시X
//                         },
//                     },
//                     {
//                         label: "총 CO₂ 배출량 (kg)", // 막대 그래프 데이터셋
//                         data: co2Data,
//                         backgroundColor: gradient,
//                         borderColor: "rgba(75, 192, 192, 1)",
//                         borderWidth: 1,
//                         type: "bar",
//                         yAxisID: "y", // y축 ID
//                         datalabels: {
//                             anchor: "end", // 데이터 레이블 위치
//                             align: "top", // 데이터 레이블 정렬
//                             formatter: (value) => value.toLocaleString(), // 값 표시 형식
//                             font: {
//                                 size: 17,
//                                 weight: "bold",
//                             },
//                         },
//                     },
//                 ],
//             },
//             options: {
//                 responsive: true, // 반응형 차트
//                 scales: {
//                     y: {
//                         beginAtZero: true,
//                         title: {
//                             display: true,
//                             text: "CO₂ 배출량 (kg)", // y축 제목
//                         },
//                     },
//                     x: {
//                         title: {
//                             display: true,
//                             text: "월", // x축 제목
//                         },
//                     },
//                 },
//             },
//             plugins: [ChartDataLabels], // 데이터 레이블 플러그인 추가
//         });
//     })
//     .catch((error) => {
//         console.error("데이터를 가져오는 중 오류 발생:", error);
//     });

let co2Chart = null;

function updateChart(data) {
    // 선택된 월 가져오기
    const selectedMonths = Array.from(document.querySelectorAll('.month-selector input:checked'))
        .map(checkbox => parseInt(checkbox.value));

    // 체크된 월이 6개 초과인 경우 알림
    if (selectedMonths.length > 6) {
        alert("최대 6개월까지만 선택 가능합니다.");
        return;
    }

    // 선택된 월에 해당하는 데이터만 필터링
    const filteredData = data.filter(item => selectedMonths.includes(item.month));

    // 데이터를 labels와 co2Data로 분리
    const labels = filteredData.map(
        (item) => `${item.year}-${String(item.month).padStart(2, "0")}`
    );
    const co2Data = filteredData.map((item) => item.total_co2);

    // 이전 차트가 있다면 제거
    if (co2Chart) {
        co2Chart.destroy();
    }

    const ctx = document.getElementById("co2Chart_bar").getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(75, 192, 192, 1)");
    gradient.addColorStop(1, "rgba(190, 220, 200, 0.5)");

    co2Chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "CO₂ 배출량 추세",
                    data: co2Data,
                    borderColor: "rgba(140, 140, 255)",
                    backgroundColor: "rgba(140, 140, 255, 0.2)",
                    borderWidth: 2,
                    type: "line",
                    yAxisID: "y",
                    datalabels: {
                        display: false,
                    },
                },
                {
                    label: "총 CO₂ 배출량 (kg)",
                    data: co2Data,
                    backgroundColor: gradient,
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                    type: "bar",
                    yAxisID: "y",
                    datalabels: {
                        anchor: "end",
                        align: "top",
                        formatter: (value) => value.toLocaleString(),
                        font: {
                            size: 17,
                            weight: "bold",
                        },
                    },
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
                        text: "CO₂ 배출량 (kg)",
                    },
                },
                x: {
                    title: {
                        display: true,
                        text: "월",
                    },
                },
            },
        },
        plugins: [ChartDataLabels],
    });
}

// 체크박스 선택 제한 함수
function limitCheckboxSelection(checkbox) {
    const checkedBoxes = document.querySelectorAll('.month-selector input:checked');
    if (checkedBoxes.length > 6) {
        checkbox.checked = false;
        alert("최대 6개월까지만 선택 가능합니다.");
    }
}

// 데이터 가져오기
fetch(`/stats/chart_bar`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);

        if (data.length === 0) {
            alert("해당 사용자의 데이터가 없습니다.");
            return;
        }

        // 체크박스 이벤트 리스너 추가
        document.querySelectorAll('.month-selector input').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                limitCheckboxSelection(e.target);
                updateChart(data);
            });
        });

        // 초기 상태로 최근 6개월 체크
        const currentMonth = new Date().getMonth() + 1; // 현재 월 (1-12)
        for (let i = 0; i < 6; i++) {
            const month = ((currentMonth - i - 1 + 12) % 12) + 1; // 최근 6개월 계산
            const checkbox = document.querySelector(`.month-selector input[value="${month}"]`);
            if (checkbox) checkbox.checked = true;
        }

        // 초기 차트 표시
        updateChart(data);
    })
    .catch((error) => {
        console.error("데이터를 가져오는 중 오류 발생:", error);
    });