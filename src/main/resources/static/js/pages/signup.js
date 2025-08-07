// 회원가입 관련 함수들의 모음
const SignupPage = () => {

  // 상태 관리 객체
  const state = {
    $form: null,
    $signUpBtn: null,
    $usernameInput: null,
    $emailInput: null,
    $passwordInput: null,
    $confirmPasswordInput: null,
  };

  // 폼 제출 이벤트
  const handleSubmit = e => {
    e.preventDefault();
    console.log('form이 제출됨!');
  };

  // 이벤트 걸기
  const bindEvents = () => {
    // 1. form 제출 이벤트
    state.$form.addEventListener('submit', handleSubmit);
  };

  // 초기화 함수
  const init = () => {
    console.log('회원가입 JS가 로딩되었습니다.');

    // 필요한 DOM들을 가져오기
    state.$form = document.getElementById('signupForm');
    state.$signupBtn = document.getElementById('signupBtn');
    state.$usernameInput = document.getElementById('usernameInput');
    state.$emailInput = document.getElementById('email');
    state.$passwordInput = document.getElementById('password');
    state.$confirmPasswordInput = document.getElementById('confirmPassword');

    // 이벤트 바인딩
    bindEvents();
  };

  return {
    init
  };
};

export default SignupPage;