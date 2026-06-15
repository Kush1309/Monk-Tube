import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add authorization token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt token refresh
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Call refresh token endpoint (using a fresh axios instance to avoid infinite loops)
          const refreshRes = await axios.post(`${API_BASE_URL}/users/refresh-token`, { refreshToken });

          if (refreshRes.status === 200 && refreshRes.data?.data?.accessToken) {
            const newAccessToken = refreshRes.data.data.accessToken;
            const newRefreshToken = refreshRes.data.data.refreshToken;

            localStorage.setItem('accessToken', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Session refresh failed:', refreshError);
      }

      // If refresh fails or no refresh token is stored, log out user
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // Dispatch custom event to let auth context know the token is expired
      window.dispatchEvent(new Event('auth-expired'));
    }

    return Promise.reject(error);
  }
);

export default api;
