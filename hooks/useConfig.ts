import { AxiosRequestConfig } from "axios";

export function useConfig() {
	function mergeRequestConfig(
		config?: AxiosRequestConfig
	): AxiosRequestConfig {
		if (!config) {
			config = {};
		}

		if (!config.baseURL) {
			config.baseURL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
		}

		if (!config.headers) {
			config.headers = {};
		}

		return config;
	}

	return {
		mergeRequestConfig,
	};
}

export default useConfig;
