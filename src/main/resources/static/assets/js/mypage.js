const coinNames = {
    'KRW-BTC': '비트코인',
    'KRW-ETH': '이더리움',
    'KRW-SOL': '솔라나',
    'KRW-XRP': '리플',
    'KRW-ETC': '이더리움(클)',
    'KRW-LINK': '체인링크',
    'KRW-DOGE': '도지코인',
    'KRW-ADA': '카르다노',
    'KRW-AVAX': '아발란체',
    'KRW-MATIC': '폴리곤',
    'KRW-DOT': '폴카닷',
    'KRW-TRX': '트론',
    'KRW-SHIB': '시바이누',
    'KRW-ATOM': '코스모스'
};

// 가정된 금액 데이터입니다. 실제로는 서버나 API로부터 받아야 합니다.
const coinValues = {
    'KRW-BTC': '100,000,000',
    'KRW-ETH': '1,000,000',
    'KRW-SOL': '2,000,000'',
    'KRW-XRP': '3,000,000'',
    'KRW-ETC': '3,000,000',
    'KRW-LINK': '3,000,000',
    'KRW-DOGE': '2,000,000',
    'KRW-ADA': '2',
    'KRW-AVAX': '100',
    'KRW-MATIC': '3,000',
    'KRW-DOT': '4,000',
    'KRW-TRX': '5,000',
    'KRW-SHIB': '6,000',
    'KRW-ATOM': '3'
};

function updateTable() {
    const tableBody = document.getElementById('coinTableBody');
    tableBody.innerHTML = ''; // 테이블 초기화

    for (const [code, name] of Object.entries(coinNames)) {
        const row = tableBody.insertRow();

        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);

        // 첫 번째 셀에는 종목명과 코드를 표시합니다.
        cell1.innerHTML = `${name}<br><small>${code}</small>`;

        // 두 번째 셀에는 금액과 "KRW"를 표시합니다.
        cell2.innerHTML = `${code}<br><small>KRW</small>`;
    }
}

// 페이지 로드 시 테이블 업데이트
updateTable();