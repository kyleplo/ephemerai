export async function fetchCalendar(url: string): Promise<[string | null, Response]> {
  var fileName, resp;
  try {
    const calendarUrl = new URL(url);
    if (calendarUrl.protocol !== "https:" || /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.test(calendarUrl.hostname) || calendarUrl.hostname.startsWith("[") || calendarUrl.port.length) {
      return [null, new Response("400 Bad Request - Bad Calendar URL", {
        status: 400,
        statusText: "Bad Request - Bad Calendar URL",
        headers: {
          "Content-Type": "text/plain"
        }
      })];
    }
    fileName = calendarUrl.pathname.split("/").at(-1);
    resp = await fetch(calendarUrl.href);
    if (!resp.ok || !resp.body) {
      return [null, new Response("502 Bad Gateway - Failed to Fetch Calendar", {
        status: 502,
        statusText: "Bad Request - Failed to Fetch Calendar",
        headers: {
          "Content-Type": "text/plain"
        }
      })];
    }
    if (!resp.headers.has("Content-Type") || !(resp.headers.get("Content-Type") as string).includes("text/calendar")) {
      console.log(resp.headers.get("Content-Type"))
      return [null, new Response("502 Bad Gateway - Invalid Calendar Data", {
        status: 502,
        statusText: "Bad Request - Invalid Calendar Data",
        headers: {
          "Content-Type": "text/plain"
        }
      })];
    }
    return [fileName as string, resp];
  } catch (e) {
    return [null, new Response("400 Bad Request - Invalid Calendar URL", {
      status: 400,
      statusText: "Bad Request - Invalid Calendar URL",
      headers: {
        "Content-Type": "text/plain"
      }
    })];
  };
}