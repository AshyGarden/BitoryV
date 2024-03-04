startbtn.addEventListener("click", () => {
    if (oti.value === "" || otb.value === "") {
        alert("형식에 맞게 정보를 입력해주세요");
    } else {
        // AJAX 요청으로 서버에 로그인 정보 전송
        fetch("/loginProcess?oti=" + oti.value + "&otb=" + otb.value, {
            method: 'GET'
        }).then(response => {
            if (response.ok) {
                // 로그인 성공 시 페이지 이동
                window.location.href = "/trend";
            } else {
                alert("로그인 실패");
            }
        });
    }
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

