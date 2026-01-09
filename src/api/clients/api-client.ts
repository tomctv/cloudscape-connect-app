import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";
import { env } from "@/config/env";

/**
 * Custom error class for API errors with additional context
 */
export class ApiError extends Error {
  public statusCode?: number;
  public originalError?: AxiosError;

  constructor(
    message: string,
    statusCode?: number,
    originalError?: AxiosError
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.originalError = originalError;

    // Keep correct stack trace (necessary for Safari/Edge)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Creates and configures the Axios instance
 */
function createAxiosInstance(): AxiosInstance {
  const instance = axios.create({
    baseURL: env.VITE_API_BASE_URL,
    timeout: env.VITE_API_TIMEOUT,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Configure response interceptor for error handling
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const statusCode = error.response?.status;
      const errorMessage = error.message;

      console.error("API request failed", {
        url: error.config?.url,
        method: error.config?.method,
        status: statusCode,
        message: errorMessage,
      });

      // Transform error to custom ApiError
      throw new ApiError(
        errorMessage || "An unexpected error occurred",
        statusCode,
        error
      );
    }
  );

  return instance;
}

// Create the singleton instance
const axiosInstance = createAxiosInstance();

/**
 * Generic typed API client wrapper
 * Provides type-safe methods for HTTP requests
 */
export interface ApiClientConfig extends AxiosRequestConfig {
  signal?: AbortSignal;
}

/**
 * Generic wrapper for the app client instance in order to separate API layers.
 */
const apiClient = {
  /**
   * GET request
   */
  get: <T = unknown>(url: string, config?: ApiClientConfig) =>
    axiosInstance.get<T>(url, config).then((res) => res.data),

  /**
   * POST request
   */
  post: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiClientConfig
  ) => axiosInstance.post<T>(url, data, config).then((res) => res.data),

  /**
   * PUT request
   */
  put: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiClientConfig
  ) => axiosInstance.put<T>(url, data, config).then((res) => res.data),

  /**
   * PATCH request
   */
  patch: <T = unknown, D = unknown>(
    url: string,
    data?: D,
    config?: ApiClientConfig
  ) => axiosInstance.patch<T>(url, data, config).then((res) => res.data),

  /**
   * DELETE request
   */
  delete: <T = unknown>(url: string, config?: ApiClientConfig) =>
    axiosInstance.delete<T>(url, config).then((res) => res.data),
};

export default apiClient;

// Export raw instance for advanced use cases
export { axiosInstance };
