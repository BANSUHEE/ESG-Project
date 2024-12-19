import { fetchAndUpdateChartBar } from "./record_chart_bar.js";
import { fetchAndUpdateChartPie } from "./record_chart_pie.js";

// 연도 선택 시 차트 업데이트
document
    .getElementById("yearSelect")
    ?.addEventListener("change", updateBothCharts);

// 연도 선택 시 월 카드 업데이트
document
    .getElementById("yearSelect")
    ?.addEventListener("change", updateCardsByYear);

// 월 카드 클릭 이벤트
function selectMonthCard(card) {
    const selectedMonth = card.getAttribute("data-month");
    const selectedYear = document.getElementById("yearSelect").value;

    if (card.classList.contains("no-data")) {
        const confirmInput = confirm("데이터가 없습니다. 입력하시겠습니까?");
        if (confirmInput) {
            window.location.href = `/stats/calculator?year=${selectedYear}&month=${selectedMonth}`;
        }
    } else {
        document.querySelectorAll(".month-card").forEach((card) => {
            card.classList.remove("active");
        });
        card.classList.add("active");

        fetchAndUpdateChartBar(selectedMonth, selectedYear);
        fetchAndUpdateChartPie(selectedMonth, selectedYear);
    }
}

// 두 차트 업데이트
function updateBothCharts() {
    const selectedYear = document.getElementById("yearSelect")?.value;
    const selectedMonth =
        document
            .querySelector(".month-card.active")
            ?.getAttribute("data-month") || new Date().getMonth() + 1;

    if (selectedMonth && selectedYear) {
        fetchAndUpdateChartBar(selectedMonth, selectedYear);
        fetchAndUpdateChartPie(selectedMonth, selectedYear);
    }
}

// 초기 설정
document.addEventListener("DOMContentLoaded", () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const yearSelect = document.getElementById("yearSelect");
    if (yearSelect) {
        // 초기 연도 설정
        yearSelect.value = currentYear;
    }

    // 현재 월에 해당하는 카드 활성화
    const currentCard = document.querySelector(
        `.month-card[data-month="${currentMonth}"]`
    );
    if (currentCard) currentCard.classList.add("active");

    // 초기 데이터 로드
    updateBothCharts();
});
function updateCardsByYear() {
    const selectedYear = document.getElementById("yearSelect").value;

    fetch(`/stats/yearly-emissions?selectedYear=${selectedYear}`)
        .then((response) => response.json())
        .then((data) => {
            document.querySelectorAll(".month-card").forEach((card) => {
                const cardMonth = card.getAttribute("data-month");
                const totalCo2Element = document.getElementById(
                    `co2-month-${cardMonth}`
                );
                const monthData = data.find((item) => item.month == cardMonth);

                card.classList.remove("has-data", "no-data");
                if (monthData && monthData.total_co2 > 0) {
                    card.classList.add("has-data");
                    totalCo2Element.textContent = `${monthData.total_co2} kg`;
                } else {
                    card.classList.add("no-data");
                    totalCo2Element.textContent = " - ";
                }
            });
        })
        .catch((error) => {
            console.error("월 카드 업데이트 중 오류 발생:", error);
        });
}
// 초기 설정
document.addEventListener("DOMContentLoaded", () => {
    const currentYear = new Date().getFullYear();
    document.getElementById("yearSelect").value = currentYear;
    updateCardsByYear();
});

window.selectMonthCard = selectMonthCard;
