import { FilterGroupOptions } from "./filter";
import { prompt, schema } from "./prompt";
import { doRateLimit } from "./rateLimit";

export async function performAi(url: URL, ip: string, ctx: ExecutionContext, ai: Ai<AiModels>) {
  var callCount = 0;
  const remainingCalls = await doRateLimit(ip, ctx);
  if (remainingCalls <= 0) {
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
      remainingCalls
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
    ],
    "response_format": {
      type: "json_schema",
      "json_schema": schema
    }
  });

  try {
    // @ts-ignore
    const filters = JSON.parse(response.response) as FilterGroupOptions & { mode?: string };
    filters.all = filters.mode === "all" || filters.mode === "some" || filters.mode === "and";// "and" isn't a real mode but the AI likes to use it anyway
    filters.invert = filters.mode === "some" || filters.mode === "none";
    if (!filters.filters) {
      return new Response(JSON.stringify({
        error: "AI Generated Invalid Response",
        remainingCalls
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
      remainingCalls,
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
      remainingCalls
    }), {
      status: 500,
      statusText: "Internal Server Error - AI Generated Invalid Response",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}