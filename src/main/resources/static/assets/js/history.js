// <============================== 거래량 TOP5 ==========================================>
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

var accTradePrice24hData = []; // 24시간 누적 거래대금 데이터를 저장할 배열

// WebSocket 연결 생성
var ws = new WebSocket('wss://api.upbit.com/websocket/v1');
ws.binaryType = 'arraybuffer'; // 데이터 타입을 arraybuffer로 설정합니다.

ws.onopen = function() {
    var subscribeMessage = JSON.stringify([
        { ticket: "test" },
        { type: "ticker", codes: Object.keys(coinNames) }
    ]);
    ws.send(subscribeMessage);
};

ws.onmessage = function(event) {
    var enc = new TextDecoder("utf-8");
    var arr = new Uint8Array(event.data);
    var data = enc.decode(arr);
    var response = JSON.parse(data);

    if(response.type === "ticker") {
        var code = response.code;
        var accTradePrice24h = response.acc_trade_price_24h; // 24시간 누적 거래대금

        var foundIndex = accTradePrice24hData.findIndex(item => item.code === code);
        if (foundIndex !== -1) {
            accTradePrice24hData[foundIndex].accTradePrice24h = accTradePrice24h;
        } else {
            accTradePrice24hData.push({ code: code, accTradePrice24h: accTradePrice24h });
        }

        accTradePrice24hData.sort((a, b) => b.accTradePrice24h - a.accTradePrice24h);
        accTradePrice24hData = accTradePrice24hData.slice(0, 5);

        updateTable();
    }
};


function updateTable() {
    var tableBody = document.getElementById('realtimeTradeVolumeTable')?.getElementsByTagName('tbody')[0];
    if (!tableBody) return;

    tableBody.innerHTML = '';
    accTradePrice24hData.forEach(function(item) {
        var row = tableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

        cell1.innerHTML = coinNames[item.code] + '<br><small>' + item.code + '</small>';
        cell2.textContent = item.accTradePrice24h.toLocaleString('en-US', {maximumFractionDigits: 2}); // 24시간 누적 거래대금을 소수점 두 자리까지 표시
    });
};

ws.onerror = function(error) {
    console.log('WebSocket Error: ', error);
};

ws.onclose = function() {
    console.log('WebSocket connection closed');
};




// <========================================= 실시간 변동률 =======================================================>

var coinPriceData = []; // 변경: 코인의 가격 정보를 저장할 배열

// 변경: WebSocket 연결 생성
var coinWs = new WebSocket('wss://api.upbit.com/websocket/v1');
coinWs.binaryType = 'arraybuffer'; // 데이터 타입을 arraybuffer로 설정합니다.

coinWs.onopen = function() {
    var subscribeMsg = JSON.stringify([
        { ticket: "test" },
        { type: "ticker", codes: Object.keys(coinNames) }
    ]);
    coinWs.send(subscribeMsg);
};

coinWs.onmessage = function(event) {
    var encoder = new TextDecoder("utf-8");
    var arr = new Uint8Array(event.data);
    var data = encoder.decode(arr);
    var response = JSON.parse(data);

    var coinCode = response.code;
    var coinTradePrice = Math.floor(response.trade_price); // 변경: 소수점을 제거

    var foundIdx = coinPriceData.findIndex(item => item.code === coinCode);
    if (foundIdx !== -1) {
        coinPriceData[foundIdx].prevPrice = coinPriceData[foundIdx].currentPrice;
        coinPriceData[foundIdx].currentPrice = coinTradePrice;
    } else {
        coinPriceData.push({ code: coinCode, currentPrice: coinTradePrice, prevPrice: coinTradePrice });
    }

    coinPriceData.forEach(item => {
        item.changeRate = ((item.currentPrice - item.prevPrice) / item.prevPrice) * 100;
    });

    var topCoinChangeRates = coinPriceData.slice().sort((a, b) => Math.abs(b.changeRate) - Math.abs(a.changeRate)).slice(0, 5);

    updateCoinTable(topCoinChangeRates);
};

// 변경: 함수 이름 updateTable -> updateCoinTable
function updateCoinTable(topCoinChangeRates) {
    var tableBody = document.getElementById('realtimeChangeRateTable2')?.getElementsByTagName('tbody')[0];
    if (!tableBody) return;

    tableBody.innerHTML = '';

    topCoinChangeRates.forEach(function(item) {
        var row = tableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);

        cell1.innerHTML = coinNames[item.code] + '<br><small>' + item.code + '</small>';
        cell2.textContent = item.currentPrice.toLocaleString(); // 천 단위로 구분하여 표시
        cell3.textContent = item.changeRate.toFixed(2) + '%';

        // 변동률에 따라 글자 색상 변경
        if (item.changeRate > 0) {
            row.style.color = 'red'; // 양수일 때 빨간색
        } else if (item.changeRate < 0) {
            row.style.color = 'blue'; // 음수일 때 파란색
        } else {
            row.style.color = 'black'; // 0일 때 흰색
        }
    });
    updateRateChangeChart();
};

coinWs.onerror = function(error) {
    console.log('WebSocket Error: ' + error);
};

coinWs.onclose = function() {
    console.log('WebSocket connection closed');
};


// <=============================================== Chart =====================================================>

// 24시간 누적 거래대금 TOP5를 가져오는 함수
async function fetchAccTradePrice24hTop5() {
    try {
        const response = await fetch('https://api.upbit.com/v1/ticker?markets=' + Object.keys(coinNames).join(','));
        const data = await response.json();
        // 거래대금으로 정렬하고 상위 5개를 선택합니다.
        const top5AccTradePrice24h = data.sort((a, b) => b.acc_trade_price_24h - a.acc_trade_price_24h).slice(0, 5);
        return top5AccTradePrice24h.map(item => ({
            name: coinNames[item.market],
            accTradePrice24h: item.acc_trade_price_24h
        }));
    } catch (error) {
        console.error('Error fetching acc trade price 24h data:', error);
        return [];
    }
}

// 각 코인의 일별 캔들 데이터를 가져오는 함수
async function fetchDailyCandle(market) {
    const url = `https://api.upbit.com/v1/candles/days?market=${market}&count=1`;
    const response = await fetch(url);
    const data = await response.json();
    return data[0]; // 가장 최근 일별 캔들 데이터를 반환합니다.
}

// 각 코인의 전일 종가 변동률을 가져오는 함수
async function fetchChangeRate(market) {
    const url = `https://api.upbit.com/v1/candles/days?market=${market}&count=1`;
    try {
        const response = await fetch(url);
        const [data] = await response.json(); // 첫 번째 항목(가장 최근 캔들)만 가져옵니다.
        return data;
    } catch (error) {
        console.error(`Error fetching change rate for market ${market}:`, error);
        return null; // 에러 발생 시 null 반환
    }
}

// 각 코인의 전일 종가 변동률을 가져오는 함수
async function fetchChangeRate(market) {
    const url = `https://api.upbit.com/v1/candles/days?market=${market}&count=1`;
    try {
        const response = await fetch(url);
        const [data] = await response.json(); // 첫 번째 항목(가장 최근 캔들)만 가져옵니다.
        return data;
    } catch (error) {
        console.error(`Error fetching change rate for market ${market}:`, error);
        return null; // 에러 발생 시 null 반환
    }
}

// 모든 코인의 변동률을 가져와서 TOP5를 추출하는 함수
async function fetchChangeRateTop5() {
    const marketCodes = Object.keys(coinNames);
    const changeRates = await Promise.all(marketCodes.map(fetchChangeRate));

    // null 값을 필터링하고 변동률로 정렬한 뒤 상위 5개를 선택
    const top5ChangeRates = changeRates
        .filter(rate => rate !== null)
        .sort((a, b) => b.change_rate - a.change_rate)
        .slice(0, 5)
        .map(candle => ({
            name: coinNames[candle.market],
            changeRate: candle.change_rate
        }));

    return top5ChangeRates;
}




// 함수를 호출하여 데이터를 가져옵니다.
(async () => {
    const accTradePrice24hTop5 = await fetchAccTradePrice24hTop5(); // 24시간 누적 거래대금 TOP 5 데이터를 가져옵니다.
    const changeRateTop5 = await fetchChangeRateTop5(); // 변동률 TOP 5 데이터를 가져옵니다.

    updateAccTradePrice24hChart(accTradePrice24hTop5); // 거래대금 차트를 업데이트합니다.
    updateRateChangeChart(changeRateTop5); // 변동률 차트를 업데이트합니다.

    console.log('24시간 누적 거래대금 TOP 5:', accTradePrice24hTop5);
    console.log('변동률 TOP 5:', changeRateTop5);
})();




// 24시간 누적 거래대금 TOP5 차트 업데이트 함수
function updateAccTradePrice24hChart(data) {
    const chartData = {
        labels: data.map(item => item.name), // 코인 명을 라벨로 사용
        datasets: [{
            label: '24시간 누적 거래대금 TOP 5',
            data: data.map(item => item.accTradePrice24h), // 24시간 누적 거래대금 값을 사용
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                'rgb(54, 162, 235)'
            ]
        }]
    };

    const ctx = document.getElementById('AccTradePrice24hChart').getContext('2d');
    if (window.accTradePrice24hChart) {
        window.accTradePrice24hChart.data = chartData;
        window.accTradePrice24hChart.update();
    } else {
        window.accTradePrice24hChart = new Chart(ctx, {
            type: 'polarArea',
            data: chartData,
            options: {
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '24시간 누적 거래대금 TOP5'
                    }
                }
            }
        });
    }
}



// 실시간 변동률 차트 업데이트 함수
function updateRateChangeChart(data) {
    const chartData = {
        labels: data.map(item => item.name), // 종목명을 라벨로 사용
        datasets: [{
            label: '변동률 (%)',
            data: data.map(item => item.changeRate), // 변동률 값을 사용
            backgroundColor: [
                // 배경색 배열; 데이터 개수에 맞게 조정할 수 있습니다.
                'rgba(255, 99, 132, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(201, 203, 207, 0.2)',
                'rgba(54, 162, 235, 0.2)'
            ],
            borderColor: [
                // 테두리색 배열; 데이터 개수에 맞게 조정할 수 있습니다.
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                'rgb(54, 162, 235)'
            ],
            borderWidth: 1
        }]
    };

    const ctx = document.getElementById('RateChangeChart').getContext('2d');
    if (window.rateChangeChart) {
        window.rateChangeChart.data = chartData;
        window.rateChangeChart.update();
    } else {
        window.rateChangeChart = new Chart(ctx, {
            type: 'bar',
            data: chartData,
            options: {
                maintainAspectRatio: false,
                indexAxis: 'y',
                scales: {
                    x: {
                        min: -0.09,
                        max: 0.09
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: '전일 변동률 TOP5' // 여기에 원하는 타이틀 텍스트를 입력하세요.
                    }
                }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // 로컬 스토리지에서 로그 데이터 가져오기
    const logEntries = JSON.parse(localStorage.getItem('investmentLogs')) || [];

    // 가져온 로그 데이터를 사용하여 로그 테이블에 추가하기
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

