/**
 * 우리 앱의 진입점 JS 파일
 */

// 현재 페이지 확인 함수
const getCurrentPage = () => {
  const path = window.location.pathname;
  if (path === '/login') return 'login';
  if (path === '/signup') return 'signup';
  if (path === '/dashboard') return 'dashboard';
  if (path === '/') return 'home';
  return 'default';
};

const App = () => {

// 외부 모듈 JS파일들을 로드
// 현재 어떤 페이지에 진입했는지 알아야 그에 맞는 JS를 가져올 수 있음
  const currentPage = getCurrentPage();
  console.log(`currentPage: ${currentPage}`);
  // console.log(`currentPage: ${currentPage}`);

  const init = async () => {
    try {
      const module = await import(`./pages/${currentPage}.js`);
      // console.log(module);

      if (module) {
        // default() 함수는 export default 내보낸 함수의 리턴값을 가져온다.
        const component = module.default();
        // console.log(component);
        component.init(); // 서브 모듈 실행
      }

    } catch(error) {
      console.error(`페이지 모듈 ${currentPage} 로드 실패!`, error);
    }
  };

  init();
};


// 기본 JavaScript 파일
document.addEventListener('DOMContentLoaded', () => {
  App();
  // console.log('여행 기록 관리 시스템이 로드되었습니다.');
});