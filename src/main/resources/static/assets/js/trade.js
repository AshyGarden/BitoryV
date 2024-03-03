document.addEventListener('DOMContentLoaded', function () {
    const interestedMarkets = [
        'KRW-BTC', 'KRW-ETH', 'KRW-SOL', 'KRW-XRP', 'KRW-ETC',
        'KRW-LINK', 'KRW-DOGE', 'KRW-ADA', 'KRW-AVAX', 'KRW-MATIC',
        'KRW-DOT', 'KRW-TRX', 'KRW-SHIB', 'KRW-ATOM'
    ];

    const coinNames = {
        'KRW-BTC': '비트코인', 'KRW-ETH': '이더리움', 'KRW-SOL': '솔라나',
        'KRW-XRP': '리플', 'KRW-ETC': '이더리움 클래식', 'KRW-LINK': '체인링크',
        'KRW-DOGE': '도지코인', 'KRW-ADA': '카르다노', 'KRW-AVAX': '아발란체',
        'KRW-MATIC': '폴리곤', 'KRW-DOT': '폴카닷', 'KRW-TRX': '트론',
        'KRW-SHIB': '시바이누', 'KRW-ATOM': '코스모스'
    };

    // 웹소켓 연결을 전역 변수로 이동
    var ws;

    // 클릭 이전의 정렬 순서를 저장하는 객체 초기화
    var currentSort = {};

    // 전역 변수로 선택된 코인 코드를 추적합니다.
    var selectedCoinCode = null;

    function connectWebSocket() {
        ws = new WebSocket('wss://api.upbit.com/websocket/v1');
        ws.onopen = () => {
            const message = JSON.stringify([{ ticket: "test" }, { type: "ticker", codes: interestedMarkets }]);
            ws.send(message);
        };

        // 웹소켓으로부터 메시지를 받을 때의 이벤트 핸들러를 설정합니다.
        ws.onmessage = event => {
            const reader = new FileReader();
            reader.onload = () => {
                const data = JSON.parse(reader.result);
                updateMarketList(data);
                // 선택된 코인의 데이터가 도착하면 상세 테이블을 업데이트합니다.
                if (selectedCoinCode === data.code) {
                    updateDetailTable(data);
                }
                // 실시간 테이블의 각 행에 클릭 이벤트 리스너를 추가합니다.
                const row = document.querySelector(`[data-code="${data.code}"]`);
                row.removeEventListener('click', handleRealtimeRowClick); // 중복 이벤트 방지를 위해 기존 리스너를 제거합니다.
                row.addEventListener('click', () => handleRealtimeRowClick(data)); // 새로운 데이터로 리스너를 추가합니다.
            };
            reader.readAsText(event.data);
        };
    }

    connectWebSocket();

    // 새로운 테이블 업데이트 함수
    function updateMarketList(data) {
        const marketList = document.getElementById('tradeList');
        let row = marketList.querySelector(`[data-code="${data.code}"]`);
        if (!row) {
            row = createNewRow(data.code);
            marketList.appendChild(row);
        }

        // 현재가 셀을 찾고, 새로운 현재가와 이전 현재가를 비교
        const currentPriceCell = row.querySelector('.current-price');
        const changeCell = row.querySelector('.change');
        const newCurrentPrice = data.trade_price;
        const oldCurrentPrice = parseFloat(currentPriceCell.getAttribute('data-old-price')) || newCurrentPrice;

        // 변화율과 변화액 값을 계산
        const changeRateValue = (data.signed_change_rate * 100).toFixed(2);
        const priceChangeValue = data.signed_change_price.toLocaleString();
        const changeRateAndPrice = `${changeRateValue}%<br/>${priceChangeValue}`;
        const isPositive = data.signed_change_rate > 0;

        // 색상 및 효과 설정
        const colorClass = isPositive ? 'positive' : 'negative';
        currentPriceCell.classList.add(colorClass);
        changeCell.classList.add(colorClass);
        row.querySelector('.coin-name').innerHTML = `${coinNames[data.code] || '알 수 없음'}<br/>${data.code}`;
        currentPriceCell.textContent = `${newCurrentPrice.toLocaleString()}`;
        currentPriceCell.setAttribute('data-old-price', newCurrentPrice);
        changeCell.innerHTML = changeRateAndPrice;

        // 24시간 누적 거래대금 설정
        const accTradePrice24hValue = Math.floor(data.acc_trade_price_24h / 1000000);
        row.querySelector('.acc-trade-price-24h').textContent = `${accTradePrice24hValue.toLocaleString()} 백만`;

        // 변화 감지 및 테두리 반짝이는 효과 적용
        if (newCurrentPrice > oldCurrentPrice) {
            applyFlashEffect(currentPriceCell, 'flash-border-red');
        } else if (newCurrentPrice < oldCurrentPrice) {
            applyFlashEffect(currentPriceCell, 'flash-border-blue');
        }
    }

    function applyFlashEffect(element, effectClass) {
        element.classList.add(effectClass);
        setTimeout(() => element.classList.remove(effectClass), 1000); // 1초 후 효과 제거
    }

    function createNewRow(code) {
        const marketList = document.getElementById('tradeList');
        const row = document.createElement('tr');
        row.setAttribute('data-code', code);
        row.innerHTML = `
            <td class="coin-name two-lines"></td>
            <td class="current-price"></td>
            <td class="change two-lines"></td>
            <td class="acc-trade-price-24h"></td>
        `;
        marketList.appendChild(row);
        return row;
    }

    // 실시간 테이블 클릭 이벤트 핸들러
    function handleRealtimeRowClick(data) {
        // 클릭된 코인의 상세 정보를 새로운 테이블에 업데이트합니다.
        updateDetailTable({
            name: coinNames[data.code] || '알 수 없음',
            code: data.code,
            currentPrice: data.trade_price.toLocaleString(),
            changeRate: (data.signed_change_rate * 100).toFixed(2),
            volume24h: (data.acc_trade_volume_24h),
            highPrice: data.high_price.toLocaleString(),
            tradeAmount24h: (data.acc_trade_price_24h),
            lowPrice: data.low_price.toLocaleString(),
            tradeStrength: data.trade_strength || '-', // 'undefined' 대신에 실제 데이터가 들어가야 합니다.
            prevClosingPrice: data.prev_closing_price.toLocaleString()
        });

        // 주문 가능 금액 input 태그에 현재가 설정
        var orderPriceInput = document.getElementById('orderPrice');
        if (orderPriceInput) { // 주문 가능 금액 input 요소가 존재하는지 확인합니다.
            orderPriceInput.value = data.trade_price;
        }

        // 매도 주문가격 input 태그에 현재가를 설정합니다.
        var sellOrderPriceInput = document.getElementById('sellOrderPrice');
        if (sellOrderPriceInput) { // 매도 주문가격 input 요소가 존재하는지 확인합니다.
            sellOrderPriceInput.value = data.trade_price;
        }

        // coinData.currentPrice 값을 가진 input 요소를 찾아 현재가를 설정합니다.
        var currentPriceInput = document.querySelector('input[type="number"][value="[[${coinData.currentPrice}]]"]');
        if (currentPriceInput) { // 해당 input 요소가 존재하는지 확인합니다.
            currentPriceInput.value = data.trade_price;
        }

            window.selectedCoinCode = data.code; // 이 부분 추가

    }

    // 상세 테이블 업데이트 함수
    function updateDetailTable(coinData) {
        document.getElementById('coinName2').getElementsByTagName('h4')[0].textContent = coinData.name;
        document.getElementById('coinCode2').textContent = coinData.code;
        document.getElementById('currentPrice2').textContent = coinData.currentPrice;
        document.getElementById('changeRate2').textContent = coinData.changeRate + '%';
        document.getElementById('highPrice2').textContent = coinData.highPrice;

        /* 거래량 설정 */
        const accTradePrice24hValue2 = (coinData.volume24h / 1000000).toFixed(3);
        document.getElementById('volume2').textContent = `${accTradePrice24hValue2.toLocaleString()} 백만` + coinData.code.split('-')[1];

        /* 거래대금(24) 설정 */
        const accTradePrice24h2 = Math.floor(coinData.tradeAmount24h / 1000000);
        document.getElementById('tradeAmount2').textContent = `${accTradePrice24h2.toLocaleString()} 백만`;

        document.getElementById('lowPrice2').textContent = coinData.lowPrice;
        document.getElementById('tradeStrength2').textContent = coinData.tradeStrength;
        document.getElementById('prevClosingPrice2').textContent = coinData.prevClosingPrice;
    }

});

// <============================== 매수/매도 창활성화 자바스크립트 ====================================>

document.addEventListener('DOMContentLoaded', function () {
    // 매수/매도 버튼 이벤트
    function toggleTradeWindows(event) {
        var isBuyButton = event.target.id === 'buyButton';
        document.getElementById('buyWindow').style.display = isBuyButton ? 'block' : 'none';
        document.getElementById('sellWindow').style.display = isBuyButton ? 'none' : 'block';
    }

    // 지정가/시장가 라디오 버튼 이벤트
    function toggleOrderType(event) {
        var isLimitOrder = event.target.id === 'limitOrder';
        var limitOrderContent = document.getElementById('limitOrderContent');
        var marketOrderContent = document.getElementById('marketOrderContent');

        // 지정가 및 시장가 내용을 토글합니다.
        if (isLimitOrder) {
            limitOrderContent.style.display = 'block';
            marketOrderContent.style.display = 'none';
        } else {
            limitOrderContent.style.display = 'none';
            marketOrderContent.style.display = 'block';
        }
    }

    // 버튼 클릭 이벤트 리스너 등록
    document.getElementById('buyButton').addEventListener('click', toggleTradeWindows);
    document.getElementById('sellButton').addEventListener('click', toggleTradeWindows);

    // 라디오 버튼 클릭 이벤트 리스너 등록
    document.getElementById('limitOrder').addEventListener('click', toggleOrderType);
    document.getElementById('marketOrder').addEventListener('click', toggleOrderType);
});

document.addEventListener('DOMContentLoaded', function () {
    var sellOrderTypeRadios = document.querySelectorAll('input[name="sellOrderType"]');
    sellOrderTypeRadios.forEach(function (radio) {
        radio.addEventListener('change', function () {
            toggleSellOrderContent();
        });
    });

    function toggleSellOrderContent() {
        var limitSellOrderContent = document.getElementById('limitSellOrderContent');
        var marketSellOrderContent = document.getElementById('marketSellOrderContent');
        if (document.getElementById('limitSellOrder').checked) {
            limitSellOrderContent.style.display = '';
            marketSellOrderContent.style.display = 'none';
        } else {
            limitSellOrderContent.style.display = 'none';
            marketSellOrderContent.style.display = '';
        }
    }

    // 초기 상태 설정
    toggleSellOrderContent();
});



// <==================== 매도/매수 예상금액  =======================================================>

// 매수 및 매도 주문수량 입력란을 가져옵니다.
var orderQuantityInput = document.getElementById("orderQuantity");
var sellOrderQuantityInput = document.getElementById("sellOrderQuantity");

// 매수와 매도 주문수량 입력란에 입력이 발생할 때마다 예상금액을 계산하는 함수를 실행합니다.
orderQuantityInput.addEventListener("input", calculateEstimatedAmount);
sellOrderQuantityInput.addEventListener("input", calculateEstimatedAmount);

// 예상금액을 계산하는 함수 정의
function calculateEstimatedAmount() {
    // 매수 주문금액 또는 매도 주문금액을 가져옵니다.
    var orderPrice = parseFloat(document.getElementById("orderPrice").value);
    var sellOrderPrice = parseFloat(document.getElementById("sellOrderPrice").value);

    // 매수 주문수량 또는 매도 주문수량을 가져옵니다.
    var orderQuantity = parseFloat(orderQuantityInput.value);
    var sellOrderQuantity = parseFloat(sellOrderQuantityInput.value);

    // 매수 예상금액을 계산합니다.
    var estimatedAmount = orderPrice * orderQuantity;

    // 매도 예상금액을 계산합니다.
    var sellEstimatedAmount = sellOrderPrice * sellOrderQuantity;

    // 계산된 예상금액을 화면에 출력합니다.
    document.getElementById("estimatedAmountDisplay").textContent = estimatedAmount.toFixed(2); // 소수점 둘째 자리까지 표시
    document.getElementById("sellestimatedAmountDisplay").textContent = sellEstimatedAmount.toFixed(2); // 소수점 둘째 자리까지 표시
}



// <==================== 매도/매수 예상금액  =======================================================>
// // 매수 버튼 클릭 시
   document.getElementById("OrderModalFirstButton").addEventListener("click", function() {


       var coinName = document.getElementById("coinName2").textContent.trim();
       var coinCode = document.getElementById("coinCode2").textContent.trim();
       var orderPrice = parseFloat(document.getElementById("orderPrice").value);
       var orderQuantity = parseFloat(document.getElementById("orderQuantity").value);
       var estimatedAmount = parseFloat(document.getElementById("estimatedAmountDisplay").textContent);
       var commission = estimatedAmount * 0.0025; // 수수료는 거래금액의 0.25%
       var totalAmountWithCommission = estimatedAmount + commission; // 수수료 포함 금액

       // 모달 내용에 해당 정보를 표시
       document.querySelector("#OrderModal .modal-body").innerHTML = `
           <table style="color:dark;">
               <tr>
                   <td data-coin-code=${coinCode}>${coinName}(${coinCode})</td>
                   <td>${orderQuantity.toFixed(4)}${coinCode.split('-')[1]}</td>
               </tr>
               <tr>
                   <td>${orderPrice.toLocaleString()} KRW</td>
                   <td>${new Date().toLocaleString()}</td>
               </tr>
               <tr>
                   <td>매수 금액 (수수료 미포함)</td>
                   <td>${estimatedAmount.toFixed(2)} KRW</td>
               </tr>
               <tr>
                   <td>수수료 (예상금액의 0.25%)</td>
                   <td>${commission.toFixed(2)} KRW</td>
               </tr>
               <tr>
                   <td>총 합계 (수수료 포함)</td>
                   <td>${totalAmountWithCommission.toFixed(2)} KRW</td>
               </tr>
           </table>
       `;

       // 모달 열기
       $('#OrderModal').modal('show');



   });


// 코인 선택 시 coinCode 업데이트
document.querySelectorAll('.coin-item').forEach(item => {
    item.addEventListener('click', function() {
        const selectedCoinCode = this.getAttribute('data-coin-code');
        // 선택된 코인 코드를 전역 변수나 적절한 저장소에 저장
        window.selectedCoinCode = selectedCoinCode;
        // 필요하다면 추가 로직 실행
    });
});



// 매수/매도 성공 후 테이블에 내용을 추가하고 로컬 스토리지에 저장하는 함수
function addToInvestmentLog(coinName, coinCode, orderPrice, orderQuantity, totalAmountWithCommission, estimatedAmount, commission, isBuy) {
    const logTableBody = document.getElementById('investmentLogTableBody');
    const currentDate = new Date();

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${currentDate.toLocaleDateString()}<br>${currentDate.toLocaleTimeString()}</td>
        <td>매수액: ${parseFloat(estimatedAmount).toLocaleString()} 원<br>
            총액: ${totalAmountWithCommission.toLocaleString()} 원</td>
        <td>${coinName}<br>${orderQuantity.toFixed(4)} ${coinCode.split('-')[1]}</td>
        <td>${isBuy ? '매수' : '매도'}</td>
    `;
    logTableBody.appendChild(newRow);

    // 로컬 스토리지에 로그 데이터 저장하기
    const logEntries = JSON.parse(localStorage.getItem('investmentLogs')) || [];
    logEntries.push({
        date: currentDate.toLocaleDateString(),
        time: currentDate.toLocaleTimeString(),
        price: `${parseFloat(estimatedAmount).toLocaleString()} 원 / ${totalAmountWithCommission.toLocaleString()} 원`,
        coinName: coinName,
        quantity: `${orderQuantity.toFixed(4)} ${coinCode.split('-')[1]}`,
        isBuy: isBuy ? '매수' : '매도'
    });
    localStorage.setItem('investmentLogs', JSON.stringify(logEntries));
}



// 매수 실행 버튼 클릭 이벤트
document.getElementById("confirmBuyButton").addEventListener("click", function() {
    var coinName = document.getElementById("coinName2").textContent.trim();
    var coinCode = document.getElementById("coinCode2").textContent.trim();
    var orderPrice = parseFloat(document.getElementById("orderPrice").value);
    var orderQuantity = parseFloat(document.getElementById("orderQuantity").value);
    var estimatedAmount = orderPrice * orderQuantity; // 예상 금액을 주문 가격과 수량을 곱하여 계산합니다.
    var commission = estimatedAmount * 0.0025; // 수수료 계산
    var totalAmountWithCommission = estimatedAmount + commission; // 총 금액 계산

    // AJAX 요청
    fetch('/api/buy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            coinCode: coinCode,
            orderPrice: orderPrice,
            orderQuantity: orderQuantity,
            totalAmount: totalAmountWithCommission
        })
    })
    .then(response => response.json())
    .then(data => {
        alert('매수 주문이 성공적으로 처리되었습니다.');
        // 성공 응답을 받은 후 로그에 추가
        addToInvestmentLog(coinName, coinCode, orderPrice, orderQuantity, totalAmountWithCommission, estimatedAmount, commission, true);
        $('#OrderModal').modal('hide'); // 모달 닫기
    })
    .catch(error => {
        console.error('매수 주문 처리 중 오류 발생:', error);
        alert('매수 주문 처리 중 오류가 발생했습니다.');
        $('#OrderModal').modal('hide'); // 모달 닫기
    });
});


 // 매도 모달 열기 버튼 클릭 이벤트
 document.getElementById("SellModalFirstButton").addEventListener("click", function() {
     var coinName = document.getElementById("coinName2").textContent.trim();
     var coinCode = document.getElementById("coinCode2").textContent.trim();
     var sellOrderPrice = parseFloat(document.getElementById("sellOrderPrice").value);
     var sellOrderQuantity = parseFloat(document.getElementById("sellOrderQuantity").value);
     var sellEstimatedAmount = parseFloat(document.getElementById("sellestimatedAmountDisplay").textContent);
     var commission = sellEstimatedAmount * 0.0025; // 수수료는 거래금액의 0.25%
     var totalAmountWithCommission = sellEstimatedAmount + commission; // 수수료 포함 금액



     // 모달 내용에 해당 정보를 표시
     document.querySelector("#SellModal .modal-body").innerHTML = `
         <table style="color:dark;">
             <tr>
                 <td>${coinName}(${coinCode})</td>
                 <td>${sellOrderQuantity.toFixed(4)}BTC</td>
             </tr>
             <tr>
                 <td>${sellOrderPrice.toLocaleString()} KRW</td>
                 <td>${new Date().toLocaleString()}</td>
             </tr>
             <tr>
                 <td>예상 금액 (수수료 미포함)</td>
                 <td>${sellEstimatedAmount.toFixed(2)} KRW</td>
             </tr>
             <tr>
                 <td>수수료 (예상금액의 0.25%)</td>
                 <td>${commission.toFixed(2)} KRW</td>
             </tr>
             <tr>
                 <td>예상 금액 (수수료 포함)</td>
                 <td>${totalAmountWithCommission.toFixed(2)} KRW</td>
             </tr>
         </table>
     `;

     // 모달 열기
     $('#SellModal').modal('show');
 });

 // 매도 실행 버튼 클릭 이벤트
 document.getElementById("confirmSellButton").addEventListener("click", function() {
     var coinName = document.getElementById("coinName2").textContent.trim();
     var coinCode = document.getElementById("coinCode2").textContent.trim();
     var sellOrderPrice = parseFloat(document.getElementById("sellOrderPrice").value);
     var sellOrderQuantity = parseFloat(document.getElementById("sellOrderQuantity").value);
     var sellEstimatedAmount = sellOrderPrice * sellOrderQuantity;
     var commission = sellEstimatedAmount * 0.0025;
     var totalAmountWithCommission = sellEstimatedAmount - commission; // 매도에서는 수수료를 차감합니다.

     // AJAX 요청을 통해 서버에 매도 주문 정보 전송
     fetch('/api/sell', {
         method: 'POST',
         headers: {
             'Content-Type': 'application/json',
         },
         body: JSON.stringify({
             coinCode: coinCode,
             sellOrderPrice: sellOrderPrice,
             sellOrderQuantity: sellOrderQuantity,
             totalAmount: totalAmountWithCommission
         })
     })
     .then(response => response.json())
     .then(data => {
         alert('매도 주문이 성공적으로 처리되었습니다.');
         addToInvestmentLog(coinName, coinCode, sellOrderPrice, sellOrderQuantity, totalAmountWithCommission, false); // isBuy를 false로 설정하여 매도임을 나타냅니다.
         $('#SellModal').modal('hide'); // 모달 닫기
     })
     .catch(error => {
         console.error('매도 주문 처리 중 오류 발생:', error);
         alert('매도 주문 처리 중 오류가 발생했습니다.');
         $('#SellModal').modal('hide'); // 모달 닫기
     });
 });


//시장가 주문가능금액

document.addEventListener('DOMContentLoaded', function() {
    // 페이지 로드가 완료되면 실행됩니다.

    // userBudget 값을 세션에서 가져옵니다.
    // 이 예제에서는 sessionStorage를 사용했지만, 실제로는 서버 세션 또는 적절한 방법을 사용해야 합니다.
    var userBudget = sessionStorage.getItem('userBudget') || '0'; // 기본값을 0으로 설정

    // 주문 가능 금액을 표시하는 태그를 찾습니다.
    var availableOrderAmountTag = document.querySelector('#marketSellOrderContent .table-order tr td:nth-child(2)');

    // 가져온 userBudget 값을 표시합니다.
    availableOrderAmountTag.textContent = `${parseInt(userBudget).toLocaleString()} 원`;
});


