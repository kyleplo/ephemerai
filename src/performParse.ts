import { fetchCalendar } from "./fetchCalendar";
import { parseCalendar } from "./parseCalendar";

export async function performParse(url: URL): Promise<Response> {
  const params = url.searchParams;
  const [fileName, resp] = await fetchCalendar(params.get("c") as string);
  if (fileName === null) {
    return resp;
  }
  const file = resp.body as ReadableStream;
  
  return new Response(file.pipeThrough(new TextDecoderStream()).pipeThrough(parseCalendar()).pipeThrough(new TextEncoderStream()), {
    headers: {
      "Content-Type": "application/json"
    }
  });
}
