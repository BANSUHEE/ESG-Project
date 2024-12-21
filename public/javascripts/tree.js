const treeData = [
    { name: "강원지방소나무", rate: 6 },
    { name: "중부지방소나무", rate: 8 },
    { name: "잣나무", rate: 6 },
    { name: "일본잎갈나무(낙엽송)", rate: 6 },
    { name: "리기다소나무", rate: 6 },
    { name: "편백", rate: 8 },
    { name: "상수리나무", rate: 4 },
    { name: "신갈나무", rate: 5 },
];

function updateTreeRequirement() {
    const selectedYear = document.getElementById("yearSelect")?.value;

    // 서버에서 해당 연도의 총 CO2 배출량 가져오기
    fetch(`/stats/total-co2?selectedYear=${selectedYear}`)
        .then((response) => response.json())
        .then((data) => {
            const username = sessionStorage.getItem("username") || "Guest";
            const totalCO2 = data.total_co2 || 0; // 총 CO2 배출량 (kg 단위)
            const tableBody = document.getElementById("treeRequirementTable");

            // 테이블 초기화
            tableBody.innerHTML = "";

            // 나무 종류별 필요한 그루 수 계산 및 테이블 업데이트
            treeData.forEach((tree) => {
                const requiredTrees = Math.ceil((totalCO2 / 1000) * tree.rate); // kg -> 톤 변환 후 계산
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${tree.name}</td>
                    <td>${tree.rate} 그루/톤</td>
                    <td>${requiredTrees} 그루</td>
                `;

                tableBody.appendChild(row);
            });

            // 탄소 배출량 텍스트 출력
            const message = `${username}님의 ${selectedYear}년 탄소 배출량은 <span style="font-weight: bolder;">${totalCO2}kg</span> 입니다.`;
            document.getElementById("co2-message-container").innerHTML =
                message;

            // 탄소 배출량에 따른 상쇄 나무 그루 수 텍스트 출력
            const minTrees = Math.ceil((totalCO2 / 1000) * 4); // 최소 필요 나무 수 (1톤당 4그루 기준)
            const maxTrees = Math.ceil((totalCO2 / 1000) * 6); // 최대 필요 나무 수 (1톤당 6그루 기준)

            const treeRequirementText = `
                이를 상쇄하기 위해서는 최소 <img src="/tree.png" alt="Tree Icon" style="width: 50px; height: 50px;"> * ${minTrees} 그루에서
                최대 <img src="/tree.png" alt="Tree Icon" style="width: 50px; height: 50px;"> * ${maxTrees} 그루의 나무가 필요합니다.
            `;

            document.getElementById("treeRequirementText").innerHTML =
                treeRequirementText;
        })
        .catch((error) => {
            console.error("데이터를 가져오는 중 오류 발생:", error);
        });
}

// 초기화
document.addEventListener("DOMContentLoaded", updateTreeRequirement);
