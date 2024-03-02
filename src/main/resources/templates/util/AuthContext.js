
//새로운 전역 Context를 생성
const AuthContext = createContext({
    isLoggedIn: false, //로그인 했는지의 여부 추적
    userName: '',
    onLogout: () => {}, //더미 함수를 넣으면 자동완성 시 편함
    onLogin: (email, password) => {},
    setUserInfo: () => {}
});

// 위에서 생성한 Context를 제공할 수 있는 provider
// 이 컴포넌트를 통해 자식 컴포넌트들에게 인증 상태와 관련된 함수들을 전달할 수 있다
export const AuthContextProvider = props => {

    let isLoggedIn = false;
    let userName = '';

//    localStorage에서 로그인 정보를 가져와서 상태를 설정

    if(localStorage.getItem('isLoggedIn') === '1') {
        setIsLoggedIn(true);
        setUserName(localStorage.getItem('LOGIN_USERNAME'));
    }



    //로그아웃 핸들러
    const logoutHandler = () => {
        localStorage.clear();
        isLoggedIn = false;
    }

    //로그인 핸들러
    const loginHandler = (token, userName) => {
        localStorage.setItem("isLoggedIn", "1");

        //json에 담긴 인증정보를 클라이언트에 보관
        // 1. 로컬 스토리지 - 브라우저가 종료되어도 보관됨
        // 2. 세션 스토리지 - 브라우저가 종료되면 사라짐
        localStorage.setItem('ACCESS_TOKEN', this.token);
        // sessionStorage.setItem('ACCESS_TOKEN', token);
        localStorage.setItem('LOGIN_USERNAME', this.userName);

        isLoggedIn = true;
        userName = this.userName;
    };

    // 토큰 및 로그인 유저 데이터를 브라우저에 저장하는 함수
    const setLoginUserInfo = ({ token, userName}) => {
        localStorage.setItem('ACCESS_TOKEN', token);
        localStorage.setItem('LOGIN_USERNAME', userName);
    }

    return {
        isLoggedIn: isLoggedIn,
        userName,
        onLogout: logoutHandler,
        onLogin: loginHandler,
        setUserInfo: setLoginUserInfo
    }

};

export default AuthContext;