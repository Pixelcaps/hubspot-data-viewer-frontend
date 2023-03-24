import axios from "axios";
import { SearchObjectDto } from "@/types";

export function useHubspot() {
	async function checkAuthStatus() {
		const { data } = await axios.get("hubspot/auth-status");

		return data;
	}

	async function getObjects(
		object: string,
		limit?: number,
		after?: string,
		properties?: string
	) {
		const { data } = await axios.get(`hubspot/${object}`, {
			params: { limit, after, properties },
		});

		return data;
	}

	async function filterObjects(object: string, body: SearchObjectDto) {
		const { data } = await axios.post(`hubspot/search/${object}`, body);

		return data;
	}

	return {
		checkAuthStatus,
		getObjects,
		filterObjects,
	};
}

export default useHubspot;
