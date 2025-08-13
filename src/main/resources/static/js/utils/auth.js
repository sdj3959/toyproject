// 인증 관련 모듈
const TOKEN = 'token';
const USER = 'user';

export const authService = {

  // 인증 상태를 체크하는 함수
  checkAuthStatus() {
    // 토큰을 가져와봄
    const token = localStorage.getItem('token');
    // 로그인한 유저정보 가져오기
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (token && user) { // 로그인 한것
      return { isAuthenticated: true, user };
    } else {
      return { isAuthenticated: false, user: null };
    }
  },

  // 헤더의 UI를 업데이트하는 함수
  updateHeaderUI() {
    const { isAuthenticated, user } = this.checkAuthStatus();

    const $userDropdown = document.getElementById('userDropdown');
    const $loginLink = document.getElementById('loginLink');
    const $usernameSpan = document.getElementById('username');

    if (isAuthenticated) { // 로그인 된 경우 UI
      $userDropdown.style.display = 'block';
      $loginLink.style.display = 'none';
      $usernameSpan.textContent = user.username;
    } else { // 로그인 안한 경우 UI
      $userDropdown.style.display = 'none';
      $loginLink.style.display = 'block';
      $usernameSpan.textContent = '사용자';
    }
  },

  login(token, user) {
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(USER, user);
  },

  // 로그아웃 처리
  logout() {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
    window.location.href = '/';
  },

  // 단순히 로그인했는지만 확인하는 함수
  isAuthenticated() {
    return this.checkAuthStatus().isAuthenticated;
  },

  // 토큰 가져오기
  getToken() {
    return localStorage.getItem(TOKEN);
  },

};