import { apiService } from '../utils/api.js';
import { utils } from '../utils/util.js';
import { authService } from '../utils/auth.js';


// 로그인 관련 함수들의 모음
const LoginPage = () => {

  const state = {
    $form: null,
  };

  // 로그인 이벤트
  const handleLogin = async (e) => {
    e.preventDefault();

    // 폼 입력값 읽기
    const formData = new FormData(state.$form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await apiService.post('/api/auth/login', payload);

      // 전달받은 토큰을 브라우저 스토리지에 안전하게 저장
      // localStorage    : 자동 로그인 1일 구현
      // sessionStorage  : 브라우저를 닫을때까지 로그인 유지
      authService.login(response.data.token, JSON.stringify(response.data.user));

      utils.showMessage(response.message, 'success');
      utils.redirectTo('/', 1000);
    } catch (error) {
      utils.showMessage(error.message, 'error');
    }
  };

  // 이벤트 걸기
  const bindEvents = () => {
    state.$form?.addEventListener('submit', handleLogin);
  };

  // 초기화 함수
  const init = () => {
    state.$form = document.getElementById('loginForm');
    bindEvents();
  };

  // public 함수
  return {
    init
  };
};

export default LoginPage;