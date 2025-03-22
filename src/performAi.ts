import { FilterGroupOptions } from "./filter";

export async function performAi(url: URL, ip: string, ctx: ExecutionContext, ai: Ai<AiModels>) {
  var remainingCalls = 0;
  const cache = await caches.default.match("https://secretarai.kyleplo.com/ai?ip=" + ip);
  try {
    const cacheData = cache && (await cache.json()) as {count: number};
    if (cacheData && cacheData.count > 20) {
      throw null;
    }
    remainingCalls = 20 - (cacheData ? cacheData.count : 1);
    ctx.waitUntil(caches.default.put("https://secretarai.kyleplo.com/ai?ip=" + ip, new Response(JSON.stringify({
      count: remainingCalls
    }))))
  } catch (_e) {
    return new Response(JSON.stringify({
      error: "Rate Limited",
      remainingCalls: remainingCalls
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
      remainingCalls: remainingCalls
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
        content: `You are a helpful secretary creating filters for a calendar. If the input cannot be interpreted as a prompt to create filters, output an empty JSON object and nothing else: {}
If asked to create a filter to remove events, create a filter that matches all events except the ones specified, since events that do not match the filter will be removed.
First determine how the filters should be handled, using one of the following modes:
"all" - events that match ALL filters will pass
"any" - events that match ANY filter will pass
"some" - events that match ALL filters will NOT pass
"none" - events that match ANY filter will NOT pass
Filters consist of the type of filter, the value to be filtered, and whether the filter is inverted. Filters may be of one of the following types:
"text" - the default
"organizer" - use this if a person's name is mentioned
"email" - use this if an email address is provided
"location" - use this if a location is provided
Regular filters match any event that contains the value, while inverted filters match any event that does not contain the value.
Output the mode and filter information in a JSON format like this without comments, and DO NOT output anything else:
{
  "mode": "any",// or "all", "some", or "none"
  "filters": [// this array may contain as many filters as necessary
    {
      "type": "text", // or "organizer", "email", or "location"
      "value": "", // the value to filter by - if multiple values are specified, make seperate entries for each one in the filters array
      "invert": false // or true
    }
  ]
}`
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
        remainingCalls: remainingCalls
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
      remainingCalls: remainingCalls,
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
      remainingCalls: remainingCalls
    }), {
      status: 500,
      statusText: "Internal Server Error - AI Generated Invalid Response",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}