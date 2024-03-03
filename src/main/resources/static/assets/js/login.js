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