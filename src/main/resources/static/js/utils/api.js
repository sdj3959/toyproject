import { authService } from './auth.js';

// API 서비스 모듈
export const apiService = {

  async request(url, options = {}) {
    const defaultOptions = {
      headers: {},
    };

    // 헤더에 토큰 추가
    const token = authService.getToken();
    if (token) {
      defaultOptions.headers['Authorization'] = `Bearer ${token}`;
    }


    const config = {...defaultOptions, ...options};

    // 본문이 FormData이면 Content-Type은 브라우저가 설정하도록 둔다
    const isFormData = config.body instanceof FormData;
    if (!isFormData) {
      config.headers = {
        'Content-Type': 'application/json',
        ...config.headers,
      };
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || '요청 실패');
    }

    return data;
  },

  async post(url, data) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  async postMultipart(url, formData) {
    return this.request(url, {
      method: 'POST',
      body: formData,
    });
  },

  async get(url) {
    return this.request(url, {
      method: 'GET',
    });
  },

  async delete(url) {
    return this.request(url, {
      method: 'DELETE'
    });
  },

  async put(url, payload) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },
};