import axios from 'axios';
import { BehaviorSubject, from, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthService } from './authService'; // Assume AuthService is implemented

const authService = new AuthService();
let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

const api = axios.create({
  baseURL: 'http://your-api-base-url.com', // Replace with your API base URL
});

api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url.includes('auth/token')) {
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        refreshTokenSubject.next(null);
        
        const refreshToken = authService.getRefreshToken();
        if (refreshToken) {
          return from(authService.refreshToken(refreshToken)).pipe(
            switchMap((token) => {
              isRefreshing = false;
              authService.saveTokens(token.token, token.refreshToken);
              refreshTokenSubject.next(token.token);

              originalRequest.headers['Authorization'] = `Bearer ${token.token}`;
              return api(originalRequest);
            }),
            catchError((err) => {
              isRefreshing = false;
              authService.signOut();
              return throwError(err);
            })
          ).toPromise();
        }
      } else {
        return refreshTokenSubject.pipe(
          filter((token) => token !== null),
          take(1),
          switchMap((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
        ).toPromise();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
