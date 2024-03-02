// 코인 코드와 코인 한글명을 매핑한 객체입니다.
const coinCodes = {
    'KRW-BTC': '비트코인',
    'KRW-ETH': '이더리움',
    'KRW-SOL': '솔라나',
    'KRW-XRP': '리플',
    'KRW-ETC': '이더리움 클래식',
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

// 웹소켓 연결을 초기화합니다.
const ws = new WebSocket('wss://api.upbit.com/websocket/v1');
ws.binaryType = 'arraybuffer';

// 변동률 데이터를 저장할 배열입니다.
let changeRatesData = [];

// 웹소켓 연결이 열리면 실행됩니다.
ws.onopen = function() {
    // 구독할 메시지 형식을 정의합니다.
    const subscribeMessage = JSON.stringify([
        { ticket: "test" },
        {
            type: "ticker",
            codes: Object.keys(coinCodes),
            isOnlySnapshot: true,
            isOnlyRealtime: true
        }
    ]);
    // 구독 메시지를 전송합니다.
    ws.send(subscribeMessage);
};

ws.onmessage = function(event) {
    const enc = new TextDecoder("utf-8");
    const arr = new Uint8Array(event.data);
    const data = JSON.parse(enc.decode(arr));

    const code = data.code;
    const changeRate = data.signed_change_rate * 100; // 변동률
    const tradePrice = data.trade_price; // 현재가

    // 데이터 배열에서 해당 코인 코드를 찾아 정보를 업데이트하거나 새로 추가합니다.
    const foundIndex = changeRatesData.findIndex(item => item.code === code);
    if (foundIndex !== -1) {
        changeRatesData[foundIndex].changeRate = changeRate;
        changeRatesData[foundIndex].tradePrice = tradePrice;
    } else {
        changeRatesData.push({ code, changeRate, tradePrice });
    }

    // 변동률을 내림차순으로 정렬합니다.
    changeRatesData.sort((a, b) => b.changeRate - a.changeRate);

    // Top 5 변동률 종목만 유지합니다.
    changeRatesData = changeRatesData.slice(0, 5);

    // Swiper 슬라이드를 업데이트하는 함수를 호출합니다.
    updateSwiperSlides();
};

// Swiper 슬라이드를 업데이트하는 함수입니다.
function updateSwiperSlides() {
    // Swiper 컨테이너 내의 슬라이드 래퍼를 선택합니다.
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    // 슬라이드 내용을 초기화합니다.
    swiperWrapper.innerHTML = '';

    // 변동률 데이터 배열을 순회하며 슬라이드를 생성합니다.
    changeRatesData.forEach(function(item) {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        // 변동률이 양수인지 음수인지에 따라 글자 색상을 결정합니다.
        const priceColor = item.changeRate >= 0 ? 'blue' : 'red';
        slide.innerHTML = `
            <table>
                <tr>
                    <th colspan="2" style="text-align: center;">${coinCodes[item.code]} (${item.code.split('-')[1]})</th>
                </tr>
                <tr>
                    <td style="text-align: right; color: ${priceColor}; font-size:30px">
                        <span style="text-align: right;">${item.tradePrice.toLocaleString()}</span>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: right; color: ${priceColor};">
                        <span>${item.changeRate.toFixed(2)}%</span>
                    </td>
                </tr>
            </table>
        `;
        swiperWrapper.appendChild(slide);
    });

    // Swiper 인스턴스에 변경 사항을 알림니다.
    if (swiper) {
        swiper.update();
    }
}


// 페이지 로드가 완료되면 실행됩니다.
document.addEventListener('DOMContentLoaded', function() {
    // Swiper 인스턴스 초기화를 여기서 수행합니다.
    swiper = new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 1000,
            disableOnInteraction: ture,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        spaceBetween: 10, // 슬라이드 사이 간격 설정
        slidesPerView: 3, // 한 번에 보여줄 슬라이드 수
        centeredSlides: false, // 슬라이드 중앙 정렬 비활성화
        loopFillGroupWithBlank: true, // 빈 슬라이드로 그룹을 채움
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 10,
            },
        }
    });
});

// 이전에 정의된 함수들(ws.onopen, ws.onmessage, updateSwiperSlides)은 변경 없이 유지합니다.
