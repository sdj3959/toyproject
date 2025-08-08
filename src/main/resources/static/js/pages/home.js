import { authService } from '../utils/auth.js';

const HomePage = () => {
  // 상태 관리
  const state = {
    user: null,
  };

  // 로그인된 사용자용 UI 설정
  const setAuthenticatedUI = (user) => {
    const $welcomeMessage = document.getElementById('welcomeMessage');
    const $leadMessage = document.getElementById('leadMessage');
    const $descriptionText = document.getElementById('descriptionText');
    const $mainActionBtn = document.getElementById('mainActionBtn');
    const $infoAlert = document.getElementById('infoAlert');
    const $infoText = document.getElementById('infoText');

    $welcomeMessage.textContent = `${user.username}님, 환영합니다!`;

    $leadMessage.textContent =
      '여행 기록을 관리하고 소중한 추억을 보존하세요.';

    $descriptionText.textContent =
      '대시보드에서 여행 계획, 여행일지, 사진 관리 등 모든 기능을 이용할 수 있습니다.';

    $mainActionBtn.innerHTML = '<i class="bi bi-house"></i> 대시보드로 이동';

    $infoAlert.className = 'alert alert-success';

    $infoText.innerHTML = `<strong>${user.username}님</strong>이 로그인되어 있습니다.
        <a href="/dashboard" class="alert-link">대시보드</a>에서 여행 기록을 관리하세요.`;
  };

  // 비로그인 사용자용 UI 설정
  const setUnauthenticatedUI = () => {
    const $welcomeMessage = document.getElementById('welcomeMessage');
    const $leadMessage = document.getElementById('leadMessage');
    const $descriptionText = document.getElementById('descriptionText');
    const $mainActionBtn = document.getElementById('mainActionBtn');

    $welcomeMessage.textContent =
      '여행 기록 관리 시스템에 오신 것을 환영합니다!';

    $leadMessage.textContent =
      '소중한 여행 추억을 디지털로 보존하고 체계적으로 관리하세요.';

    $descriptionText.textContent =
      '여행 계획부터 여행일지 작성, 사진 관리까지 모든 것을 한 곳에서 관리할 수 있습니다.';

    $mainActionBtn.innerHTML =
      '<i class="bi bi-box-arrow-in-right"></i> 로그인하기';
    $mainActionBtn.href = '/login';
  };

  // UI 업데이트
  const updateUI = () => {
    const { isAuthenticated, user } = authService.checkAuthStatus();

    // home 화면 업데이트
    if (isAuthenticated) {
      state.user = user;
      setAuthenticatedUI(user);
    } else {
      state.user = null;
      setUnauthenticatedUI();
    }
  };

  // 초기화 함수
  const init = () => {
    updateUI();
  };

  // 컴포넌트 반환
  return {
    init
  };
};

export default HomePage;
