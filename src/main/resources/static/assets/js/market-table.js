document.addEventListener('DOMContentLoaded', function () {
  // 주요 마켓 정보
  const majorMarkets = {
    'KRW-BTC': 1, 'KRW-ETH': 2, 'KRW-SOL': 3, 'KRW-XRP': 4, 'KRW-ETC': 5,
    'KRW-LINK': 6, 'KRW-DOGE': 7, 'KRW-ADA': 8, 'KRW-AVAX': 9, 'KRW-MATIC': 10,
    'KRW-DOT': 11, 'KRW-TRX': 12, 'KRW-SHIB': 13, 'KRW-ATOM': 14
  };

  // 코인 이름 정보
  const coinNames = {
    'KRW-BTC': '비트코인', 'KRW-ETH': '이더리움', 'KRW-SOL': '솔라나',
    'KRW-XRP': '리플', 'KRW-ETC': '이더리움 클래식', 'KRW-LINK': '체인링크',
    'KRW-DOGE': '도지코인', 'KRW-ADA': '카르다노', 'KRW-AVAX': '아발란체',
    'KRW-MATIC': '폴리곤', 'KRW-DOT': '폴카닷', 'KRW-TRX': '트론',
    'KRW-SHIB': '시바이누', 'KRW-ATOM': '코스모스'
  };

  const marketList = document.getElementById('marketList');
  const rowsByCode = {};

  // 관심 마켓
  const interestedMarkets = Object.keys(majorMarkets);

  // WebSocket 연결
  function connectWebSocket() {
    const ws = new WebSocket('wss://api.upbit.com/websocket/v1');

    ws.onopen = () => {
      console.log('WebSocket 연결됨');
      ws.send(JSON.stringify([{ ticket: "test" }, { type: "ticker", codes: interestedMarkets }]));
    };

    ws.onmessage = event => processBlob(event.data);
    ws.onerror = error => console.error('WebSocket 오류: ', error);
    ws.onclose = () => console.log('WebSocket 연결 종료됨');
  }

  // WebSocket 메시지 처리
  function processBlob(blobData) {
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const jsonData = JSON.parse(event.target.result);
        updateMarketList(jsonData);
      } catch (e) {
        console.error('JSON 파싱 오류', e);
      }
    };
    reader.readAsText(blobData);
  }

  // 시장 목록 업데이트
  function updateMarketList(tickerData) {
    if (!tickerData || !tickerData.code) {
      console.error('유효하지 않은 티커 데이터', tickerData);
      return;
    }
    const code = tickerData.code;
    rowsByCode[code] ? updateExistingRow(tickerData, rowsByCode[code]) : createNewRow(tickerData);
  }

  // 새로운 행 생성
  function createNewRow(tickerData) {
    const row = document.createElement('tr');
    addCellsToRow(row, tickerData);
    marketList.appendChild(row);
    rowsByCode[tickerData.code] = row;
  }

  // 기존 행 업데이트
  function updateExistingRow(tickerData, row) {
    addCellsToRow(row, tickerData, true);
  }

  // 행에 셀 추가
  function addCellsToRow(row, tickerData, isUpdate = false) {
    if (!isUpdate) row.innerHTML = ''; // 업데이트 시 기존 내용 초기화

    const coinName = coinNames[tickerData.code] || '알 수 없음';
    const currentPrice = Math.floor(parseFloat(tickerData.trade_price)).toLocaleString();
    const priceChange = getPriceChangeHtml(tickerData); // 변화액에 따른 HTML 생성
    const changeRate = (tickerData.signed_change_rate * 100).toFixed(2) + '%';

    const data = [
      majorMarkets[tickerData.code],
      `${coinName}<br><span class='coin-code-style'>${tickerData.code}</span>`,
      currentPrice,
      priceChange,
      Math.floor(parseFloat(tickerData.opening_price)).toLocaleString(),
      Math.floor(parseFloat(tickerData.high_price)).toLocaleString(),
      Math.floor(parseFloat(tickerData.low_price)).toLocaleString(),
      changeRate
    ];
    const cellClasses = ['no', 'coin-info', 'current-price', 'price-change', 'opening', 'high', 'low', 'change-rate'];

    data.forEach((text, index) => {
      let cell;
      if (isUpdate) {
        cell = row.cells[index];
      } else {
        cell = row.insertCell();
        cell.classList.add(cellClasses[index]);
      }
      cell.innerHTML = text;
    });

    setChangeRateStyle(row.cells[7], tickerData.signed_change_rate); // 등락률에 따른 셀 스타일 설정
  }

  // 변화액 HTML 생성 및 색상 설정
  function getPriceChangeHtml(tickerData) {
    const priceChange = Math.floor(parseFloat(tickerData.signed_change_price));
    const formattedPriceChange = priceChange.toLocaleString();
    const colorClass = priceChange > 0 ? 'up' : priceChange < 0 ? 'down' : 'no-change';
    return `<span class="${colorClass}">${formattedPriceChange}</span>`;
  }

  // 등락률에 따른 셀 스타일 설정
  function setChangeRateStyle(cell, changeRate) {
    cell.className = getChangeClassName(changeRate);
    cell.style.color = changeRate > 0 ? 'red' : changeRate < 0 ? 'blue' : 'black';
  }

  // 등락률에 따른 CSS 클래스 반환
  function getChangeClassName(changeRate) {
    return changeRate > 0 ? 'up' : changeRate < 0 ? 'down' : 'no-change';
  }

  // 페이지 로드 시 WebSocket 연결
  connectWebSocket();
});
