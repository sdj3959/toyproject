// 공통 유틸리티 모듈
export const utils = {

  // 메시지 창을 띄웠다가 닫는 함수
  showMessage(message, type = 'info', container = null) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${
      type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'
    } alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const targetContainer =
      container || document.querySelector('.card-body') || document.body;
    targetContainer.insertBefore(alertDiv, targetContainer.firstChild);

    // 5초 후 자동 제거
    setTimeout(() => {
      if (alertDiv.parentNode) {
        alertDiv.remove();
      }
    }, 5000);
  },

  setLoadingState(button, isLoading) {
    const spinner = button.querySelector('.spinner-border');
    if (isLoading) {
      button.disabled = true;
      spinner?.classList.remove('d-none');
    } else {
      button.disabled = false;
      spinner?.classList.add('d-none');
    }
  },

  validateForm(form) {
    const requiredInputs = form.querySelectorAll('input[required]');
    let isValid = true;

    requiredInputs.forEach((input) => {
      // 필수 필드가 비어있는지 확인
      if (!input.value.trim()) {
        isValid = false;
        return;
      }

      // 특별한 검증 규칙들
      if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          isValid = false;
          return;
        }
      }

      if (input.name === 'password') {
        if (input.value.length < 6) {
          isValid = false;
          return;
        }
      }

      if (input.name === 'username') {
        if (input.value.length < 3) {
          isValid = false;
          return;
        }
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (!usernameRegex.test(input.value)) {
          isValid = false;
          return;
        }
      }
    });

    if (!isValid) {
      form.classList.add('was-validated');
      // 폼 전체에 흔들림 효과 추가
      form.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        form.style.animation = '';
      }, 500);
    }

    return isValid;
  },

  // 페이지 이동 함수
  redirectTo(path, delay = 0) {
    setTimeout(() => {
      window.location.href = path;
    }, delay);
  },

  // 디바운스 함수
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
  },
};
