document.addEventListener('DOMContentLoaded', function() {
    const startBtn = document.getElementById('startbtn');
    const oti = document.getElementById('oti');
    const otb = document.getElementById('otb');

    startBtn.addEventListener("click", () => {
        // 입력 값 가져오기
        var idInput = oti.value.trim();
        var budgetInput = parseInt(otb.value, 10);

        // ID 검증 - 영어와 숫자만 허용
        var idPattern = /^[a-zA-Z0-9]+$/;
        if (!idPattern.test(idInput)) {
            alert("아이디는 영어와 숫자로만 작성해주세요.");
            return; // 함수 종료
        }

        // 자산금액 검증 - 10만원에서 10억원 사이
        if (isNaN(budgetInput) || budgetInput < 100000 || budgetInput > 1000000000) {
            alert("자산금액은 10만원에서 10억원까지만 입력 가능합니다.");
            return; // 함수 종료
        }

        // AJAX 요청으로 서버에 로그인 정보 전송
        fetch("/loginProcess?oti=" + idInput + "&otb=" + budgetInput, {
            method: 'GET'
        }).then(response => {
            if (response.ok) {
                // 로그인 성공 시 페이지 이동
                window.location.href = "/trend";
            } else {
                alert("로그인 실패");
            }
        }).catch(error => {
            console.error('Error:', error);
            alert("로그인 처리 중 오류가 발생했습니다.");
        });
    });
});


document.addEventListener('DOMContentLoaded', function() {
    // 'Ready For Virtual Investment!' 버튼에 클릭 이벤트 리스너 추가
    document.getElementById('startbtn').addEventListener('click', function() {
        const otiValue = document.getElementById('oti').value; // 사용자가 입력한 아이디
        const otbValue = document.getElementById('otb').value; // 사용자가 입력한 초기 예산

        // 입력값 검증 (예: 값이 비어있는지 확인)
        if (!otiValue || otbValue <= 0) {
            alert('올바른 값을 입력해주세요.');
            return; // 함수 실행 중단
        }

        // 로컬 스토리지에 사용자 정보 저장
        localStorage.setItem('oti', otiValue);
        localStorage.setItem('otb', otbValue);

        // 로컬 스토리지에서 'investmentLogs' 데이터 삭제
        localStorage.removeItem('investmentLogs');

        // 여기에 다른 로직이 필요하다면 추가하세요. 예를 들어, 다른 페이지로 리디렉션 등
    });
});

