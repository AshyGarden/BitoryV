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

var tradeVolumes = []; // 체결량 데이터를 저장할 배열

// WebSocket 연결 생성
var ws = new WebSocket('wss://api.upbit.com/websocket/v1');
ws.binaryType = 'arraybuffer'; // 데이터 타입을 arraybuffer로 설정합니다.

ws.onopen = function() {
    var subscribeMessage = JSON.stringify([
        { ticket: "test" },
        { type: "trade", codes: Object.keys(coinNames) }
    ]);
    ws.send(subscribeMessage);
};

ws.onmessage = function(event) {
    var enc = new TextDecoder("utf-8");
    var arr = new Uint8Array(event.data);
    var data = enc.decode(arr);
    var response = JSON.parse(data);

    var code = response.code;
    var tradeVolume = response.trade_volume;

    var foundIndex = tradeVolumes.findIndex(item => item.code === code);
    if (foundIndex !== -1) {
        tradeVolumes[foundIndex].tradeVolume = tradeVolume;
    } else {
        tradeVolumes.push({ code: code, tradeVolume: tradeVolume });
    }

    tradeVolumes.sort((a, b) => b.tradeVolume - a.tradeVolume);
    tradeVolumes = tradeVolumes.slice(0, 5);

    updateTable();
};

function updateTable() {
    // 이 부분은 실제 테이블 요소가 HTML에 존재하는지 확인해야 합니다.
    var tableBody = document.getElementById('realtimeTradeVolumeTable')?.getElementsByTagName('tbody')[0];
    if (!tableBody) return; // 테이블 요소가 없으면 함수를 종료합니다.

    tableBody.innerHTML = '';

    tradeVolumes.forEach(function(item) {
        var row = tableBody.insertRow();
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);

        cell1.innerHTML = coinNames[item.code] + '<br><small>' + item.code + '</small>';
        cell2.textContent = item.tradeVolume.toFixed(2); // trade_volume 값을 소수점 2자리까지 표시합니다.
    });

    // 차트 업데이트 로직 추가
        updateTradeVolumeChart();
};

ws.onerror = function(error) {
    console.log('WebSocket Error: ' + error);
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

// 거래량 TOP5 차트 업데이트 함수
function updateTradeVolumeChart() {
    const chartData = {
        labels: tradeVolumes.map(item => coinNames[item.code]),
        datasets: [{
            label: '거래량 TOP 5',
            data: tradeVolumes.map(item => item.tradeVolume),
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(75, 192, 192)',
                'rgb(255, 205, 86)',
                'rgb(201, 203, 207)',
                'rgb(54, 162, 235)'
            ]
        }]
    };

    const ctx = document.getElementById('TradeVolumeChart').getContext('2d');
    if (window.tradeVolumeChart) {
        window.tradeVolumeChart.data = chartData;
        window.tradeVolumeChart.update();
    } else {
        window.tradeVolumeChart = new Chart(ctx, {
            type: 'polarArea',
            data: chartData,
            options: {
                maintainAspectRatio: false
            }
        });
    }
}



// 실시간 변동률 차트 업데이트 함수
function updateRateChangeChart() {
    // 원하는 라벨 값
    const customLabels = ["-1%", "-0.5%", "0%", "0.5%", "1%"];

    // 모든 종목에 대한 데이터 포함
    const allData = coinPriceData.map(item => {
        return {
            code: item.code,
            name: coinNames[item.code],
            changeRate: item.changeRate
        };
    });

    // 변동률이 높은 순으로 정렬
    const sortedData = allData.sort((a, b) => b.changeRate - a.changeRate);

    // 변동률 데이터 추출
    const chartData = {
        labels: sortedData.map(item => item.name), // 종목명을 라벨로 사용
        datasets: [{
            label: '변동률 (%)',
            data: sortedData.map(item => item.changeRate), // 변동률 값을 사용
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 205, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(201, 203, 207, 0.2)',
                'rgba(255, 99, 132, 0.2)'
            ],
            borderColor: [
                'rgb(255, 99, 132)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)',
                'rgb(255, 159, 64)',
                'rgb(255, 205, 86)',
                'rgb(75, 192, 192)',
                'rgb(54, 162, 235)',
                'rgb(153, 102, 255)',
                'rgb(201, 203, 207)',
                'rgb(255, 99, 132)'
            ],
            borderWidth: 1,
            options: {
                maintainAspectRatio: false,
                indexAxis: 'y', // y축을 사용하여 데이터 표시
                scales: {
                    x: {
                        min: -0.3, // x축의 최소값 설정
                        max: 0.3   // x축의 최대값 설정
                    }
                }
            }
        }]
    };

    const ctx = document.getElementById('RateChangeChart').getContext('2d');
        if (window.rateChangeChart) {
            window.rateChangeChart.data = chartData;
            window.rateChangeChart.options.scales.y.ticks.font.size = 10; // y축 라벨 글자 크기를 10으로 설정
            window.rateChangeChart.update();
        } else {
            window.rateChangeChart = new Chart(ctx, {
                type: 'bar',
                data: chartData,
                options: {
                    maintainAspectRatio: false,
                    indexAxis: 'y',
                    scales: {
                        y: { // y축 설정
                            ticks: {
                                font: {
                                    size: 10 // 여기에서 글자 크기를 설정합니다.
                                }
                            }
                        },
                        x: { // 기존의 x축 설정을 유지합니다.
                            min: -0.3,
                            max: 0.3
                        }
                    }
                }
            });
        }
    }



