// Virtual Account Infos
let vrtfrm = document.querySelector("#virtualform"); //로그인 폼
let oti = document.querySelector("#oti"); //One Time Initial
let otb = document.querySelector("#otb"); //One Time Budget(KRW)
let startbtn = document.querySelector("#startbtn"); //로그인 버튼

startbtn?.addEventListener("click", () => {
    if (oti.value === "") {
        alert("형식에 맞게 이니셜을 입력해주세요");
    } else if (otb.value === "") {
        alert("시작 예산을 입력하세요");
    } else {
        vrtfrm.method = "get";
        vrtfrm.action = "/trend";
        localStorage.setItem(oti, otb);
        vrtfrm.submit();
    }
});
