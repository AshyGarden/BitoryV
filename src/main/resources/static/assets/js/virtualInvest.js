

document.addEventListener('DOMContentLoaded', function() {
    const logEntries = JSON.parse(localStorage.getItem('investmentLogs')) || [];
    const logTableBody = document.getElementById('investmentLogTableBody');

    logEntries.forEach(entry => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${entry.date}<br>${entry.time}</td>
            <td>${entry.price}</td>
            <td>${entry.coinName}<br>${entry.quantity}</td>
            <td>${entry.isBuy}</td>
        `;
        logTableBody.appendChild(newRow);
    });
});


//1. JavaScript로 로컬 스토리지에서 데이터를 불러와 JSON으로 변환

function getInvestmentLogs() {
    const logs = localStorage.getItem('investmentLogs');
    console.log(JSON.parse(logs));
    console.log(typeof(JSON.parse(logs)));

    return JSON.parse(logs) || [];
}

//2. AJAX를 사용하여 이 JSON 데이터를 Python으로 전송
// 로컬 스토리지에서 로그 데이터를 불러와 서버로 전송
function sendInvestmentLogs() {
    const logs = localStorage.getItem('investmentLogs');
    fetch('http://127.0.0.1:5000/process-logs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: logs // 로컬 스토리지에서 가져온 로그 데이터를 문자열 그대로 전송
    })
    .then(response => response.json())
    .then(data => {
        console.log('Server response:', data);
        displayProcessedLogs(data); // 서버로부터 받은 응답을 처리
    })
    .catch(error => {
        console.error('Error sending logs:', error);
    });
}


// 예시용 함수 호출
const logs = getInvestmentLogs();
sendInvestmentLogs(logs);


//5. JavaScript로 응답 받은 데이터를 HTML에 표시
// 서버로부터 받은 응답 데이터를 화면에 표시
function displayProcessedLogs(data) {
    // 예시: 서버 응답을 페이지의 특정 부분에 표시
    const responseContainer = document.getElementById('responseContainer');
    responseContainer.textContent = JSON.stringify(data, null, 2);
}