// 현재 날짜로 기본 설정
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate.getMonth() + 1; // 월은 0부터 시작하므로 +1

// 년도와 월 선택 요소의 기본값 설정
// $("#yearSelect").val(currentYear);
// $("#monthSelect").val(currentMonth);

// CO₂ 배출량을 계산하여 총량 업데이트 함수 정의
function updateTotalCO2() {
    const electricityCO2 = parseFloat($("#electricity-co2").text()) || 0;
    const gasCO2 = parseFloat($("#gas-co2").text()) || 0;
    const waterCO2 = parseFloat($("#water-co2").text()) || 0;
    const transportCO2 = parseFloat($("#transport-co2").text()) || 0;
    const wasteCO2 = parseFloat($("#waste-co2").text()) || 0;

    const totalCO2 =
        electricityCO2 + gasCO2 + waterCO2 + transportCO2 + wasteCO2;
    $("#totalCo2").text(totalCO2.toFixed(2));
}

// 전기 사용량 CO₂ 계산
$("#electricity-usage").on("input", function () {
    const usage = $(this).val();
    const co2Emission = usage * 0.4781;
    $("#electricity-co2").text(co2Emission.toFixed(2));
    updateTotalCO2();
});

// 가스 사용량 CO₂ 계산
$("#gas-usage").on("input", function () {
    const usage = $(this).val();
    const co2Emission = usage * 2.176;
    $("#gas-co2").text(co2Emission.toFixed(2));
    updateTotalCO2();
});

// 수도 사용량 CO₂ 계산
$("#water-usage").on("input", function () {
    const usage = $(this).val();
    const co2Emission = usage * 0.237;
    $("#water-co2").text(co2Emission.toFixed(2));
    updateTotalCO2();
});

// 교통 CO₂ 계산
$("#distance").on("input", function () {
    calculateTransportCO2();
    updateTotalCO2();
});
$('input[name="carType"]').on("change", function () {
    calculateTransportCO2();
    updateTotalCO2();
});

function calculateTransportCO2() {
    const distance = $("#distance").val();
    const carType = $('input[name="carType"]:checked').val();
    const emissionFactor =
        carType === "휘발유" ? 2.097 : carType === "경유" ? 2.582 : 1.868;
    const co2Emission = distance * emissionFactor;
    $("#transport-co2").text(co2Emission.toFixed(2));
}

// 폐기물 CO₂ 계산
$("#waste-amount").on("input", function () {
    const usage = $(this).val();
    const co2Emission = usage * 0.125;
    $("#waste-co2").text(co2Emission.toFixed(2));
    updateTotalCO2();
});

// 저장 버튼 클릭
$("#saveButton").on("click", function () {
    const username = sessionStorage.getItem("username");
    const year = parseInt($("#yearSelect").val()); // 숫자로 변환
    const month = parseInt($("#monthSelect").val()); // 숫자로 변환
    const electricityCO2 = parseFloat($("#electricity-co2").text()) || 0;
    const gasCO2 = parseFloat($("#gas-co2").text()) || 0;
    const waterCO2 = parseFloat($("#water-co2").text()) || 0;
    const transportCO2 = parseFloat($("#transport-co2").text()) || 0;
    const wasteCO2 = parseFloat($("#waste-co2").text()) || 0;
    const totalCO2 = parseFloat($("#totalCo2").text()) || 0;

    // alert(year + "년" + month + "월");

    // 년, 월 선택 여부와 CO2 총량 입력 여부 확인
    if (!year || !month) {
        alert("년과 월을 선택하세요.");
        return;
    }

    if (totalCO2 <= 0) {
        alert("CO₂ 양을 입력하세요.");
        return;
    }

    // AJAX 요청으로 데이터 전송
    $.ajax({
        url: "/stats/calculator", // Node.js 백엔드에서 처리할 경로
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            username: username,
            year: year,
            month: month,
            electricity_co2: electricityCO2,
            gas_co2: gasCO2,
            water_co2: waterCO2,
            transport_co2: transportCO2,
            waste_co2: wasteCO2,
            total_co2: totalCO2,
        }),
        success: function (response) {
            alert("데이터가 성공적으로 저장되었습니다.");
            window.location.href = `/stats/record?year=${year}`;
        },
        error: function (xhr, status, error) {
            alert("데이터 저장 중 오류가 발생했습니다.");
            console.error(error);
        },
    });
});
