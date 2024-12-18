import { fetchAndUpdateChartBar } from "./record_chart_bar.js";
import { fetchAndUpdateChartPie } from "./record_chart_pie.js";

// 공통 이벤트 리스너
document
    .getElementById("yearSelect")
    .addEventListener("change", updateBothCharts);
document.querySelectorAll(".month-selector input").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
        // 다른 체크박스 해제
        document.querySelectorAll(".month-selector input").forEach((cb) => {
            if (cb !== e.target) cb.checked = false;
        });
        updateBothCharts();
    });
});

// 두 차트 업데이트 함수 호출
function updateBothCharts() {
    const selectedYear = document.getElementById("yearSelect").value;
    const selectedMonth =
        document.querySelector(".month-selector input:checked")?.value ||
        new Date().getMonth() + 1;

    // 각각의 차트 업데이트 함수 호출
    fetchAndUpdateChartBar(selectedMonth, selectedYear); // Bar 차트
    fetchAndUpdateChartPie(selectedMonth, selectedYear); // Pie 차트
}

// 초기 데이터 로드
document.addEventListener("DOMContentLoaded", () => {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // 초기 설정
    document.getElementById("yearSelect").value = currentYear;
    document.querySelector(
        `.month-selector input[value="${currentMonth}"]`
    ).checked = true;

    updateBothCharts();
});
