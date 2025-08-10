import { FilterGroupOptions } from "./filter";
import { prompt } from "./prompt";

const rateLimit = 20;

export async function performAi(url: URL, ip: string, ctx: ExecutionContext, ai: Ai<AiModels>) {
  var callCount = 0;
  const cache = await caches.default.match("https://ephemerai.kyleplo.com/ai?ip=" + ip);
  try {
    const cacheData = cache && (await cache.json()) as {count: number};
    if (cacheData && cacheData.count >= rateLimit) {
      throw null;
    }
    callCount = (cacheData ? cacheData.count + 1 : 1);
    ctx.waitUntil(caches.default.put("https://ephemerai.kyleplo.com/ai?ip=" + ip, new Response(JSON.stringify({
      count: callCount
    }))))
  } catch (_e) {
    return new Response(JSON.stringify({
      error: "Rate Limited",
      remainingCalls: 0
    }), {
      status: 429,
      statusText: "Too Many Requests - Rate Limited",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  if (!url.searchParams.has("p") || (url.searchParams.get("p") as string).length < 10 || (url.searchParams.get("p") as string).length > 256) { 
    return new Response(JSON.stringify({
      error: "Invalid Prompt",
      remainingCalls: rateLimit - callCount
    }), {
      status: 400,
      statusText: "Bad Request - Invalid Prompt",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }

  const response = await ai.run("@cf/mistral/mistral-7b-instruct-v0.1", {
    max_tokens: 128,
    messages: [
      {
        role: "system",
        content: prompt
      },
      {
        role: "user",
        content: decodeURIComponent(url.searchParams.get("p") as string)
      }
    ]
  });

  try {
    // @ts-ignore
    const filters = JSON.parse(response.response) as FilterGroupOptions & { mode?: string };
    filters.all = filters.mode === "all" || filters.mode === "some" || filters.mode === "and";// "and" isn't a real mode but the AI likes to use it anyway
    filters.invert = filters.mode === "some" || filters.mode === "none";
    if (!filters.filters) {
      return new Response(JSON.stringify({
        error: "AI Generated Invalid Response",
        remainingCalls: rateLimit - callCount
      }), {
        status: 500,
        statusText: "Internal Server Error - AI Generated Invalid Response",
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    delete filters.mode;
    return new Response(JSON.stringify({
      remainingCalls: rateLimit - callCount,
      filters: filters
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({
      error: "AI Generated Invalid Response",
      remainingCalls: rateLimit - callCount
    }), {
      status: 500,
      statusText: "Internal Server Error - AI Generated Invalid Response",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}