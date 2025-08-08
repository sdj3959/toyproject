import { apiService } from '../utils/api.js';
import { utils } from '../utils/util.js';


// 회원가입 관련 함수들의 모음
const SignupPage = () => {

  const { debounce } = utils;

  // 상태 관리 객체
  const state = {
    $form: null,
    $signUpBtn: null,
    $usernameInput: null,
    $emailInput: null,
    $passwordInput: null,
    $confirmPasswordInput: null,
  };

  // 검증 상태 아이콘 생성
  const createValidationIcon = (inputElement, isValid) => {
    // 기존 아이콘 제거
    const existingIcon =
      inputElement.parentNode.querySelector('.validation-icon');
    if (existingIcon) {
      existingIcon.remove();
    }

    // 새 아이콘 생성
    const icon = document.createElement('i');
    icon.className = `validation-icon ${isValid ? 'valid' : 'invalid'}`;
    icon.innerHTML = isValid ? '✓' : '✗';

    return icon;
  };

  // 검증 메시지 표시
  const showValidationMessage = (inputElement, message, type) => {
    // 기존 메시지 제거
    const existingMessage = inputElement.parentNode.querySelector(
      '.validation-message'
    );
    if (existingMessage) {
      existingMessage.remove();
    }

    if (message) {
      const messageElement = document.createElement('div');
      messageElement.className = `validation-message ${type}`;

      // 검증 아이콘 생성
      const icon = createValidationIcon(inputElement, type === 'success');

      // 아이콘과 메시지를 함께 추가
      messageElement.append(icon);
      messageElement.append(document.createTextNode(' ' + message));

      inputElement.parentNode.append(messageElement);
    }
  };


  // 입력 필드 상태 업데이트
  const updateInputState = (inputElement, isValid, message = '') => {
    // 입력 필드를 input-group으로 감싸기
    if (!inputElement.parentNode.classList.contains('input-group')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'input-group real-time-validation';

      // 부모 요소에서 input을 제거하고 wrapper에 추가
      inputElement.before(wrapper);
      wrapper.append(inputElement);
    }

    // 클래스 업데이트
    inputElement.classList.remove('is-valid', 'is-invalid');
    inputElement.classList.add(isValid ? 'is-valid' : 'is-invalid');

    // 검증 메시지 표시 (아이콘 포함)
    showValidationMessage(inputElement, message, isValid ? 'success' : 'error');
  };


  // 사용자명 중복확인 함수
  const checkDuplicateUsername = async (username) => {

    try {
      const response = await apiService.get(`/api/auth/check-username?username=${username}`);

      // UI에 피드백 표시
      if (response.data) { // 중복임
        updateInputState(
          state.$usernameInput
          , false
          , response.message
        );
      } else { // 사용가능
        updateInputState(
          state.$usernameInput
          , true
          , response.message
        );
      }

    } catch (error) {
      console.error(error.message);
    }
  };

  // 사용자명 중복확인 함수
  const checkDuplicateEmail = async (email) => {

    try {
      const response = await apiService.get(`/api/auth/check-email?email=${email}`);

      // UI에 피드백 표시
      if (response.data) { // 중복임
        updateInputState(
          state.$emailInput
          , false
          , response.message
        );
      } else { // 사용가능
        updateInputState(
          state.$emailInput
          , true
          , response.message
        );
      }

    } catch (error) {
      console.error(error.message);
    }
  };


  // 사용자명 입력 이벤트처리
  const handleUsernameInput = debounce(e => {

    const username = e.target.value;

    // 기본 검증
    if (username.length < 3 || username.length > 15) {
      updateInputState(
        state.$usernameInput,
        false,
        '사용자명은 3~15자 사이여야 합니다.'
      );
      return;
    }

    // 중복 확인
    checkDuplicateUsername(username);

  }, 500);


  // 사용자명 입력 이벤트처리
  const handleEmailInput = debounce(e => {

    const email = e.target.value;

    // 기본 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      updateInputState(
        state.$emailInput,
        false,
        '올바른 이메일 형식을 입력해주세요.'
      );
      return;
    }

    // 중복 확인
    checkDuplicateEmail(email);

  }, 500);



  // 폼 제출 이벤트
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      username: state.$usernameInput.value,
      password: state.$passwordInput.value,
      email: state.$emailInput.value
    };

    try {
      const response = await apiService.post('/api/auth/signup', payload);
      // console.log(response);

      if (response.success) {
        // 성공 메시지 보여줌
        utils.showMessage(response.message, 'success');
        // 2초뒤 로그인 페이지로 자동 이동
        utils.redirectTo('/login', 2000);
      }
    } catch (e) {
      // 실패 메시지 렌더링
      utils.showMessage(e.message, 'error');
    }
  };

  // 이벤트 걸기
  const bindEvents = () => {
    // 1. form 제출 이벤트
    state.$form?.addEventListener('submit', handleSubmit);
    // 2. 사용자명 입력 이벤트
    state.$usernameInput?.addEventListener('input', handleUsernameInput);
    // 3. 이메일 입력 이벤트
    state.$emailInput?.addEventListener('input', handleEmailInput);
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