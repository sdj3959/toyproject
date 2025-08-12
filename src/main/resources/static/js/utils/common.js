/**
 * 공통 유틸리티 함수들
 */

// 공통 유틸리티 모듈
import { authService } from './auth.js';

// 얼럿 표시 함수
export const showAlert = (message, type = 'warning') => {
  const existingAlert = document.querySelector('.auth-alert');
  if (existingAlert) {
    existingAlert.remove();
  }

  const alert = document.createElement('div');
  alert.className = `alert alert-${type} auth-alert`;
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    padding: 15px 20px;
    border-radius: 5px;
    background-color: ${type === 'warning' ? '#fff3cd' : '#d4edda'};
    border: 1px solid ${type === 'warning' ? '#ffeaa7' : '#c3e6cb'};
    color: ${type === 'warning' ? '#856404' : '#155724'};
    font-weight: 500;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  `;
  alert.textContent = message;

  document.body.append(alert);

  setTimeout(() => {
    if (alert.parentNode) {
      alert.remove();
    }
  }, 3000);
};

// 인증 체크 함수 (페이지별 사용)
export const requireAuth = () => {
  if (!authService.isAuthenticated()) {
    showAlert('로그인이 필요한 페이지입니다. 로그인 페이지로 이동합니다.');
    setTimeout(() => {
      window.location.href = '/login';
    }, 1500);
    return false;
  }
  return true;
};

// 로딩 스피너 표시/숨김
export const showLoading = () => {
  const loading = document.createElement('div');
  loading.id = 'loading-spinner';
  loading.innerHTML = `
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    ">
      <div style="
        width: 50px;
        height: 50px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      "></div>
    </div>
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `;
  document.body.appendChild(loading);
};

export const hideLoading = () => {
  const loading = document.getElementById('loading-spinner');
  if (loading) {
    loading.remove();
  }
};

// 성공/에러 메시지 표시
export const showSuccess = (message) => {
  showAlert(message, 'success');
};

export const showError = (message) => {
  showAlert(message, 'error');
};

// 페이지 이동 함수
export const navigateTo = (path) => {
  window.location.href = path;
};

// 뒤로가기 함수
export const goBack = () => {
  window.history.back();
};

// 여행 상태 관련 유틸리티
export const TripStatusUtils = {
  /**
   * 여행 상태에 따른 색상 반환
   * @param {string} status - 여행 상태 (PLANNING, ONGOING, COMPLETED, CANCELLED)
   * @param {Object} statusInfo - 백엔드에서 받은 TripStatusInfo 객체 (선택사항)
   * @returns {string} Bootstrap 색상 클래스
   */
  getStatusColor: (status, statusInfo = null) => {
    // 백엔드에서 statusInfo를 제공한 경우 우선 사용
    if (statusInfo && statusInfo.color) {
      return statusInfo.color;
    }

    // fallback용 색상
    const colors = {
      PLANNING: 'warning',
      ONGOING: 'primary',
      COMPLETED: 'success',
      CANCELLED: 'danger',
    };
    return colors[status] || 'secondary';
  },

  /**
   * 여행 상태에 따른 텍스트 반환 (백엔드 TripStatus enum의 description 사용)
   * @param {string} status - 여행 상태
   * @param {string} description - 백엔드에서 받은 한국어 설명 (선택사항)
   * @param {Object} statusInfo - 백엔드에서 받은 TripStatusInfo 객체 (선택사항)
   * @returns {string} 한국어 상태 텍스트
   */
  getStatusText: (status, description = null, statusInfo = null) => {
    // 백엔드에서 statusInfo를 제공한 경우 우선 사용
    if (statusInfo && statusInfo.description) {
      return statusInfo.description;
    }

    // 백엔드에서 description을 제공한 경우 사용
    if (description) {
      return description;
    }

    // fallback용 텍스트 (백엔드와 동일하게 유지)
    const texts = {
      PLANNING: '계획중',
      ONGOING: '진행중',
      COMPLETED: '완료',
      CANCELLED: '취소',
    };
    return texts[status] || '알 수 없음';
  },

  /**
   * 여행 상태에 따른 아이콘 반환
   * @param {string} status - 여행 상태
   * @param {Object} statusInfo - 백엔드에서 받은 TripStatusInfo 객체 (선택사항)
   * @returns {string} Bootstrap 아이콘 클래스
   */
  getStatusIcon: (status, statusInfo = null) => {
    // 백엔드에서 statusInfo를 제공한 경우 우선 사용
    if (statusInfo && statusInfo.icon) {
      return statusInfo.icon;
    }

    // fallback용 아이콘
    const icons = {
      PLANNING: 'bi-calendar-check',
      ONGOING: 'bi-airplane',
      COMPLETED: 'bi-check-circle',
      CANCELLED: 'bi-x-circle',
    };
    return icons[status] || 'bi-question-circle';
  },
};

// 날짜 관련 유틸리티
export const DateUtils = {
  /**
   * 날짜를 한국어 형식으로 포맷
   * @param {string} dateString - 날짜 문자열
   * @returns {string} 포맷된 날짜 문자열
   */
  formatDate: (dateString) => {
    if (!dateString) return '날짜 없음';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  /**
   * 날짜와 시간을 한국어 형식으로 포맷
   * @param {string} dateString - 날짜 문자열
   * @returns {string} 포맷된 날짜시간 문자열
   */
  formatDateTime: (dateString) => {
    if (!dateString) return '날짜 없음';
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR');
  },

  /**
   * 간단한 날짜 포맷 (년-월-일)
   * @param {string} dateString - 날짜 문자열
   * @returns {string} 포맷된 날짜 문자열
   */
  formatSimpleDate: (dateString) => {
    if (!dateString) return '날짜 없음';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  },
};

// UI 관련 유틸리티
export const UIUtils = {
  /**
   * 텍스트를 지정된 길이로 자르고 말줄임표 추가
   * @param {string} text - 원본 텍스트
   * @param {number} maxLength - 최대 길이
   * @returns {string} 잘린 텍스트
   */
  truncateText: (text, maxLength = 100) => {
    if (!text) return '내용 없음';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  /**
   * 숫자를 천 단위 구분자와 함께 포맷
   * @param {number} number - 숫자
   * @returns {string} 포맷된 숫자 문자열
   */
  formatNumber: (number) => {
    if (number === null || number === undefined) return '0';
    return number.toLocaleString('ko-KR');
  },

  /**
   * 통화 형식으로 포맷 (원화)
   * @param {number} amount - 금액
   * @returns {string} 포맷된 통화 문자열
   */
  formatCurrency: (amount) => {
    if (amount === null || amount === undefined) return '0원';
    return `${amount.toLocaleString('ko-KR')}원`;
  },
};

// 검증 관련 유틸리티
export const ValidationUtils = {
  /**
   * 이메일 형식 검증
   * @param {string} email - 이메일 주소
   * @returns {boolean} 유효성 여부
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * 필수 필드 검증
   * @param {string} value - 검증할 값
   * @returns {boolean} 유효성 여부
   */
  isRequired: (value) => {
    return (
      value !== null && value !== undefined && value.toString().trim() !== ''
    );
  },

  /**
   * 최소 길이 검증
   * @param {string} value - 검증할 값
   * @param {number} minLength - 최소 길이
   * @returns {boolean} 유효성 여부
   */
  hasMinLength: (value, minLength) => {
    return value && value.toString().length >= minLength;
  },

  /**
   * 최대 길이 검증
   * @param {string} value - 검증할 값
   * @param {number} maxLength - 최대 길이
   * @returns {boolean} 유효성 여부
   */
  hasMaxLength: (value, maxLength) => {
    return value && value.toString().length <= maxLength;
  },
};

// 배열 및 객체 관련 유틸리티
export const ArrayUtils = {
  /**
   * 배열을 그룹별로 분류
   * @param {Array} array - 분류할 배열
   * @param {Function} keyFn - 키를 생성하는 함수
   * @returns {Object} 그룹화된 객체
   */
  groupBy: (array, keyFn) => {
    return array.reduce((groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {});
  },

  /**
   * 배열에서 중복 제거
   * @param {Array} array - 중복을 제거할 배열
   * @param {Function} keyFn - 키를 생성하는 함수 (선택사항)
   * @returns {Array} 중복이 제거된 배열
   */
  unique: (array, keyFn = null) => {
    if (!keyFn) {
      return [...new Set(array)];
    }

    const seen = new Set();
    return array.filter((item) => {
      const key = keyFn(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  },
};

// DOM 관련 유틸리티
export const DOMUtils = {
  /**
   * 요소의 표시 상태를 일괄 변경
   * @param {Object} elements - DOM 요소 객체
   * @param {string} state - 표시할 상태 ('loading', 'content', 'empty', 'error')
   */
  showState: (elements, state) => {
    const states = {
      loading: ['loadingContainer'],
      content: ['contentContainer'],
      empty: ['emptyContainer'],
      error: ['errorContainer'],
    };

    const targetElements = states[state] || [];

    // 모든 컨테이너 숨기기
    Object.values(elements).forEach((element) => {
      if (element && element.style) {
        element.style.display = 'none';
      }
    });

    // 대상 컨테이너만 표시
    targetElements.forEach((key) => {
      const element = elements[key];
      if (element && element.style) {
        element.style.display = 'block';
      }
    });
  },

  /**
   * 요소에 클래스 토글
   * @param {HTMLElement} element - 대상 요소
   * @param {string} className - 토글할 클래스명
   * @param {boolean} force - 강제 설정 (선택사항)
   */
  toggleClass: (element, className, force = null) => {
    if (!element) return;
    element.classList.toggle(className, force);
  },

  /**
   * 요소의 텍스트 내용 안전하게 설정
   * @param {HTMLElement} element - 대상 요소
   * @param {string} text - 설정할 텍스트
   */
  setTextContent: (element, text) => {
    if (!element) return;
    element.textContent = text || '';
  },

  /**
   * 요소의 HTML 내용 안전하게 설정
   * @param {HTMLElement} element - 대상 요소
   * @param {string} html - 설정할 HTML
   */
  setInnerHTML: (element, html) => {
    if (!element) return;
    element.innerHTML = html || '';
  },
};

// 기본 내보내기 (모든 유틸리티를 포함)
export default {
  TripStatusUtils,
  DateUtils,
  UIUtils,
  ValidationUtils,
  ArrayUtils,
  DOMUtils,
};