import { performFilter } from "./performFilter";
import { performParse } from "./performParse";
import { performAi } from "./performAi"

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === "/filter") {
			return performFilter(url);
		} else if (url.pathname === "/parse") {
			return performParse(url);
		} else if (url.pathname === "/ai") {
			return performAi(url, env.AI);
		}
		return new Response(JSON.stringify({
			error: "Not Found"
		}), {
			status: 404,
			statusText: "Not Found",
			headers: {
				"Content-Type": "application/json"
			}
		});
	},
} satisfies ExportedHandler<Env>;
