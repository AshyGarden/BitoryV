
// 로그인한 유저의 데이터 객체를 반환하는 함수
export const getLoginUserInfo = () => {
    return {
        token: localStorage.getItem('ACCESS_TOKEN'),
        username: localStorage.getItem('LOGIN_USERNAME'),
//        role: localStorage.getItem('USER_ROLE')
    };
};

// 로그인 여부를 확인하는 함수
//논리값으로 만들기(반전반전) 있으면 true 리턴
export const isLogin = () => !!localStorage.getItem('ACCESS_TOKEN');

