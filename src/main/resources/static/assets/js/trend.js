let oti = localStorage.getItem("oti");
let otb = localStorage.getItem("otb");
let returnOption;

if (oti === "" || oti === null || otb === "" || otb === null) {
    returnOption.method = "get";
    returnOption.action = "/login";
    returnOption.submit();
}


// 사용자 정보를 페이지에 표시하는 함수
function displayUserInfo() {
    // 로컬 스토리지에서 사용자 ID와 예산을 검색
    const userId = localStorage.getItem('oti'); // 사용자 ID
    const userBudget = localStorage.getItem('otb'); // 사용자 예산

    // 페이지의 사용자 정보 영역을 찾음
    const userIdElement = document.querySelector('.right_username#oti');
    const userBudgetElement = document.querySelector('.right_username#otb');

    // 사용자 정보 영역에 값을 표시
    if (userIdElement && userBudgetElement) {
        userIdElement.textContent = userId || 'User ID'; // 사용자 ID가 없으면 기본 텍스트 표시
        userBudgetElement.textContent = userBudget || 'User Budget'; // 사용자 예산이 없으면 기본 텍스트 표시
    }
}

// 페이지 로드 시 사용자 정보 표시 함수 호출
document.addEventListener('DOMContentLoaded', displayUserInfo);
