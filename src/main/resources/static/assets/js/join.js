// join
let fzipbtn = document.querySelector("#findzipbtn");
let zipbtn = document.querySelector("#zipbtn");
let dong = document.querySelector("#dong");

let zipmodal = document.querySelector("#zipmodal");
let addrlist = document.querySelector("#addrlist");
let sendzip = document.querySelector("#sendzip");
let modal = null;   // 우편번호 모달

//우편번호 검색 모달창 띄우기
zipbtn?.addEventListener('click',()=> {
    while(addrlist.lastChild){
        addrlist.removeChild(addrlist.lastChild);
    }   //이전 검색 결과 지움
    dong.value = '';    //이전 검색 키워드 지움
    try{
        //새로운 모달 창 생성
        modal = new bootstrap.Modal(zipmodal, {});
    }catch (e){}
    modal.show();     // 모달창 띄우기
});
//검색한 우편번호 결과 출력
const showzipaddr = (jsons) => {
    jsons = JSON.parse(jsons); // 문자열을 json객체로 변환
    let addr = '';
    jsons.forEach(function (data, idx){
        // 주소 번지가 null일 경우 공백처리
        let bunji = data['bunji'] !== null ? data['bunji'] :'';
      addr += `<option>${data['zipcode']} ${data['sido']} 
                ${data['gugun']} ${data['dong']} ${bunji}</option>`;
    });
    addrlist.innerHTML = addr;
};
//우편번호 검색
fzipbtn?.addEventListener('click',()=> {
    if(dong.value === '') {
        alert('동이름을 입력하세요!!');
        return;
    }
    const url = '/member/zipcode/' + dong.value;
    fetch(url).then(response => response.text())
        .then(text => showzipaddr(text));
});
//주소 선택하고 닫기
sendzip?.addEventListener('click', () =>{
    let frm = document.forms.joinfrm;
    let addr = addrlist.value;      // 선택한 주소 항목
    if (addr !== '') {
        let zip = addr.split(' ')[0];      // 우편번호 추출
        let addrs = addr.split(' ');
        let addr4 = `${addrs[4]}`;
        if (addr4==='undefined'){
            addr4 = '';
        }
        let vaddr =
            `${addrs[1]} ${addrs[2]} ${addrs[3]} ${addr[4]}`;   // 주소추출

        frm.zip.value = zip;     //[0] -> 첫번째꺼 추출
        frm.addr1.value = vaddr;
        console.log(zip);

        modal.hide();

    } else {
        alert('주소를 선택하세요!!');
    }
});

// 우편번호 검색 엔터키 입력차단
dong?.addEventListener('keydown',(e)=>{
    if(e.keyCode===13)
        e.preventDefault(); // 엔터키 입력되면 이벤트 전파 방지

});

// join - 비밀번호 확인
let pwd = document.querySelector('#pwd');
let repwd = document.querySelector('#repasswd');
let pwdmsg = document.querySelector('#pwdmsg');

// 비밀번호 입력규칙 :  영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10~16자
// 대문자, 소문자, 숫자, 특수문자를 검사하는 정규 표현식
let upper = /[A-Z]/;
let lower = /[a-z]/;
let number = /[0-9]/;
let special = /[!@#$%^&*]/;

repwd?.addEventListener('blur',() => {
    let pmsg = '비밀번호가 서로 일치하지 않습니다.';
    pwdmsg.className = 'text-danger';

    if (pwd.value === '' || repwd.value === '') {
        pmsg = '(영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10~16자)';
        pwdmsg.className = 'text-danger';
    } else {
        // 조합 개수 검증
        let matches = [upper.test(pwd.value), lower.test(pwd.value),
            number.test(pwd.value), special.test(pwd.value)].filter(Boolean).length;

        if(pwd.value.length < 10 || pwd.value.length > 16 || matches < 2) {
            pmsg = '(영문 대소문자/숫자/특수문자 중 2가지 이상 조합, 10~16자)';
            pwdmsg.className = 'text-danger';
        } else if (pwd.value === repwd.value) {
            pmsg = '비밀번호가 서로 일치합니다.';
            pwdmsg.className = 'text-primary';
        }
    }
    pwdmsg.innerText = pmsg;
});


// 아이디 중복 검사
let userid = document.querySelector('#uid');
let checkuid = document.querySelector('#checkuid');
let uidmsg = document.querySelector('#uidmsg');

const styleCheckuid = (chkuid) => {
    let umsg = '이미 사용중인 아이디입니다.';
    uidmsg.className = 'text-danger';
    checkuid.value = 'no';
    console.log(chkuid);
    if(chkuid ==='0'){
        umsg = '사용 가능한 아이디입니다.';
        uidmsg.className = 'text-primary';
        checkuid.value = 'yes';
    }
    uidmsg.innerText = umsg;
};

//아이디 중복 검사
//아이디 생성시 영문소문자 또는 숫자 4~16자를 확인하는 정규표현식
let re = /^[a-z0-9]{4,16}$/;
userid?.addEventListener('blur',() =>{
    if(userid.value===''){
        uidmsg.innerText = '아이디는 영문소문자 또는 숫자 4~16자로 입력해 주세요.';
        uidmsg.className = 'text-warning';
        checkuid.value = 'no';
        return;
    } if(!re.test(userid.value)) {
        uidmsg.innerText = '아이디는 영문소문자 또는 숫자 4~16자로 입력해 주세요.';
        uidmsg.className = 'text-danger';
        checkuid.value = 'no';
        return;
    }
    const url = '/member/checkuid/' + userid.value;
    fetch(url).then(response =>response.text())
        .then(text => styleCheckuid(text));
});

// join - 회원정보 저장
let joinbtn = document.querySelector("#joinbtn");
joinbtn?.addEventListener('click',()=>{
   let frm = document.forms.joinfrm;

   if(frm.userid.value==='') alert('아이디를 입력하세요.');
   else if(frm.passwd.value==='') alert('비밀번호를 입력하세요.');
   else if(frm.repasswd.value==='') alert('비밀번호를 확인하세요.');
   else if(frm.username.value==='') alert('이름을 입력하세요');
   else if(frm.addr1.value==='' || frm.addr2.value === '') alert('주소를 입력하세요.');
   else if(frm.email1.value==='' || frm.email2.value === '') alert('이메일을 입력하세요.');
   else if(frm.phone2.value==='' || frm.phone3.value === '') alert('전화번호를 입력하세요.');
   else if(checkuid.value==='no') alert('전화번호를 입력하세요.');
   else {

       alert('회원가입이 완료되었습니다.');
       frm.email.value = frm.email1.value + '@' + frm.email2.value;
       frm.phone.value = frm.phone1.value + '-' + frm.phone2.value + '-' + frm.phone3.value;
       frm.method = 'post';
       frm.submit();

   }

});

// joinok
let go2idx = document.querySelector('#go2idx');
go2idx?.addEventListener('click',() => {
    location.href = '/';

});
// login
let loginbtn = document.querySelector("#loginbtn");
let lguid = document.querySelector("#userid");
let lgpwd = document.querySelector("#passwd");
let lgnfrm = document.querySelector("#lgnfrm")
loginbtn?.addEventListener('click',()=>{

    if(lguid.value===''){
        alert('아이디를 입력하세요');
    }else if(lgpwd.value===''){
        alert('비밀번호를 입력하세요');
    }else{
        lgnfrm.method = 'post';
        lgnfrm.action = '/member/login';
        lgnfrm.submit();
    }
});
//logout
let lgoutbtn = document.querySelector("#lgoutbtn");
lgoutbtn?.addEventListener('click',()=>{
   location.href = '/member/logout';
});


// delete - 비밀번호 확인해야 탈퇴처리
let delbtn = document.querySelector("#delbtn");
let dlpwd = document.querySelector("#pwd");
let dlrpwd = document.querySelector("#repasswd");
let delfrm = document.querySelector("#delfrm");
delbtn?.addEventListener('click', () => {
    if(dlpwd.value !== dlrpwd.value) {
        alert('비밀번호가 일치하지 않습니다');
    } else {
        delfrm.method = 'get';
        delfrm.action = '/member/delete';
        alert('회원 탈퇴가 완료되었습니다. 이용해주셔서 감사합니다.');
        delfrm.submit();
    }
});



