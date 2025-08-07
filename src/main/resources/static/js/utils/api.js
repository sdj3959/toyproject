// API 서비스 모듈
export const apiService = {

  async request(url, options = {}) {
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const config = { ...defaultOptions, ...options };

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
  }
};
