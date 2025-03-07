import { performFilter } from "./performFilter";
import { performParse } from "./performParse";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === "/filter") {
			return performFilter(url);
		} else if (url.pathname === "/parse") {
			return performParse(url);
		}
		return new Response("404 Not Found", {
			status: 404,
			statusText: "Not Found",
			headers: {
				"Content-Type": "text/plain"
			}
		});
	},
} satisfies ExportedHandler<Env>;
