document.addEventListener('DOMContentLoaded', async function() {
    // 로딩 이미지 표시
    const loadingElement = document.getElementById('loading');
    loadingElement.style.display = 'block';

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

    try {
        // 서버로 로그 데이터 전송
        const responseData = await sendInvestmentLogs(logEntries);

        // 서버 응답 데이터를 HTML에 표시
        displayResponseData(responseData);
    } catch (error) {
        console.error('에러 발생:', error);
    } finally {
        // 로딩 이미지 제거
        loadingElement.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', async function() {
    // 로컬 스토리지에서 투자 로그 데이터 가져오기
    const logEntries = getInvestmentLogs();

    // 서버로 로그 데이터 전송
    await sendInvestmentLogs(logEntries);
});

// 서버로 투자 로그 데이터 전송하는 함수
async function sendInvestmentLogs(logEntries) {
    const logsText = getInvestmentLogsText(logEntries);

    try {
        const response = await fetch('http://localhost:8000/process-text-logs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',  // 요청 헤더를 JSON으로 설정
            },
            body: JSON.stringify({ logsText }),
        });
        const data = await response.json();
        console.log('서버 응답:', data);
        return data;
    } catch (error) {
        throw error;
    }
}

// 서버 응답 데이터를 HTML에 표시하는 함수
function displayResponseData(data) {
    const responseDataElement = document.getElementById('response-data');
    responseDataElement.innerHTML = markdownToHTML(data.data);
}

// 로컬 스토리지에서 투자 로그 데이터를 가져오는 함수
function getInvestmentLogs() {
    const logs = localStorage.getItem('investmentLogs');
    return JSON.parse(logs) || [];
}

// 로컬 스토리지에서 투자 로그 데이터를 가져와 value 값만 추출하여 텍스트로 변환
function getInvestmentLogsText(logEntries) {
    // 각 로그 항목의 value만 추출하여 텍스트로 변환
    const logsText = logEntries.map(entry => `${entry.date} ${entry.time} ${entry.price} ${entry.coinName} ${entry.quantity} ${entry.isBuy}`).join('; ');
    return logsText;
}

// Markdown을 HTML로 변환하는 함수
function markdownToHTML(markdown) {
    return markdown
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // 강조 표시
        .replace(/\n\n/g, '<br>') // 줄 바꿈 처리
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // 강조 표시
        .replace(/\| (.*?) \|/g, '<th>$1</th>') // 테이블 헤더
        .replace(/\| (.*?) \|/g, '<td>$1</td>') // 테이블 셀
        .replace(/\n/g, '<br>'); // 줄 바꿈 처리
}