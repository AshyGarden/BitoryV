// 코인 이름 정보
const coinNames3 = {
  'KRW-BTC': '비트코인', 'KRW-ETH': '이더리움', 'KRW-SOL': '솔라나',
  'KRW-XRP': '리플', 'KRW-ETC': '이더리움 클래식', 'KRW-LINK': '체인링크',
  'KRW-DOGE': '도지코인', 'KRW-ADA': '카르다노', 'KRW-AVAX': '아발란체',
  'KRW-MATIC': '폴리곤', 'KRW-DOT': '폴카닷', 'KRW-TRX': '트론',
  'KRW-SHIB': '시바이누', 'KRW-ATOM': '코스모스'
};

// select 요소를 가져옵니다.
const selectElement = document.getElementById('coinSelect');

// coinNames3 객체를 반복하여 각 코인에 대한 option 요소를 생성합니다.
for (const [value, text] of Object.entries(coinNames3)) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = text;
  selectElement.appendChild(option);
}
