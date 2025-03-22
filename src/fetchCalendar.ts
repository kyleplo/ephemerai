export async function fetchCalendar(url: string, ctx: ExecutionContext): Promise<[string | null, Response]> {
  var fileName, resp;
  try {
    const calendarUrl = new URL(url);
    if (calendarUrl.protocol !== "https:" || /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.test(calendarUrl.hostname) || calendarUrl.hostname.startsWith("[") || calendarUrl.port.length) {
      return [null, new Response(JSON.stringify({
        error: "Bad Calendar URL"
      }), {
        status: 400,
        statusText: "Bad Request - Bad Calendar URL",
        headers: {
          "Content-Type": "application/json"
        }
      })];
    }
    fileName = calendarUrl.pathname.split("/").at(-1);

    const cachedCalendar = await caches.default.match(calendarUrl);
    if (cachedCalendar) {
      return [fileName as string, cachedCalendar];
    }

    resp = await fetch(calendarUrl.href);

    const respToCache = new Response(resp.clone().body);
    respToCache.headers.set("CDN-Cache-Control", "public, max-age=3600, immutable");
    ctx.waitUntil(caches.default.put(calendarUrl, respToCache));

    if (!resp.ok || !resp.body) {
      return [null, new Response(JSON.stringify({
        error: "Failed to Fetch Calendar"
      }), {
        status: 502,
        statusText: "Bad Request - Failed to Fetch Calendar",
        headers: {
          "Content-Type": "application/json"
        }
      })];
    }
    if (!resp.headers.has("Content-Type") || !(resp.headers.get("Content-Type") as string).includes("text/calendar")) {
      return [null, new Response(JSON.stringify({
        error: "Invalid Calendar Data"
      }), {
        status: 502,
        statusText: "Bad Request - Invalid Calendar Data",
        headers: {
          "Content-Type": "application/json"
        }
      })];
    }
    return [fileName as string, resp];
  } catch (e) {
    return [null, new Response(JSON.stringify({
      error: "Invalid Calendar URL"
    }), {
      status: 400,
      statusText: "Bad Request - Invalid Calendar URL",
      headers: {
        "Content-Type": "application/json"
      }
    })];
  };
}