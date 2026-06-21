import { API_BASE_URL } from '@/lib/constants';

interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, any>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private buildURL(path: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${path}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private async request<T>(path: string, config: RequestConfig = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, params } = config;

    const url = this.buildURL(path, params);

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // 后期可以在这里添加认证 token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   requestHeaders['Authorization'] = `Bearer ${token}`;
    // }

    const requestInit: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      requestInit.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, requestInit);

      // 处理 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.detail || `Request failed with status ${response.status}`,
          response.status,
          data
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>(path, { method: 'GET', params });
  }

  async post<T>(path: string, body?: any): Promise<T> {
    return this.request<T>(path, { method: 'POST', body });
  }

  async put<T>(path: string, body?: any): Promise<T> {
    return this.request<T>(path, { method: 'PUT', body });
  }

  async delete<T>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const apiClient = new ApiClient(API_BASE_URL);