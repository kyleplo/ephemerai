import { performFilter } from "./performFilter";
import { performParse } from "./performParse";
import { performAi } from "./performAi"
import { performRateLimitTest } from "./rateLimit";

async function useCache(url: URL, ctx: ExecutionContext, process: (url: URL, ctx: ExecutionContext) => Promise<Response>): Promise<Response> {
	const cachedResponse = await caches.default.match(url);
	if (cachedResponse) {
		return cachedResponse;
	}

	const response = await process(url, ctx);
	ctx.waitUntil(caches.default.put(url, response.clone()));
	response.headers.set("CDN-Cache-Control", "public, max-age=3600, immutable");
	response.headers.set("last-modified", new Date().toUTCString());
	return response;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		if (url.pathname === "/filter") {
			return useCache(url, ctx, performFilter);
		} else if (url.pathname === "/parse") {
			return useCache(url, ctx, performParse);
		} else if (url.pathname === "/ratelimittest") {
			return performRateLimitTest(request.headers.get("CF-Connecting-IP") || "", ctx);
		} else if (url.pathname === "/ai") {
			return performAi(url, request.headers.get("CF-Connecting-IP") || "", ctx, env.AI);
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
