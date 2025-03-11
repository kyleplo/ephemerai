import { fetchCalendar } from "./fetchCalendar";
import { evaluateFilterGroup, FilterOptions } from "./filter";
import { transformCalendar, TransformOptions } from "./transformCalendar";

const filterGroupTypes = ["all", "any", "some", "none"];

function createStringFilters(type: "text" | "uid" | "organizer" | "email" | "location" | "priority", params: string[], filters: FilterOptions[]) {
  params.forEach(param => {
    filters.push({
      type: type,
      value: decodeURIComponent(param.startsWith("!") ? param.slice(1) : param),
      invert: param.startsWith("!")
    });
  });
}

export async function performFilter(url: URL): Promise<Response> {
  const params = url.searchParams;
  if (!params.has("a") && !params.has("t") && !params.has("x") && !params.has("u") && !params.has("o") && !params.has("p") && !params.has("l") && !params.has("e") && !params.has("m") && !params.has("r") && !params.has("t")) {
    return new Response(JSON.stringify({
      error: "No Filters Specified"
    }), {
      status: 400,
      statusText: "Bad Request - No Filters Specified",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  if (params.get("t") && !filterGroupTypes.includes(params.get("t") as string)) {
    return new Response(JSON.stringify({
      error: "Invalid Filter Type"
    }), {
      status: 400,
      statusText: "Bad Request - Invalid Filter Type",
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
  const [fileName, resp] = await fetchCalendar(params.get("c") as string);
  if (fileName === null) {
    return resp;
  }
  const file = resp.body as ReadableStream;
  const transformOptions: TransformOptions = {
    removeAlarms: params.has("a"),
    makeTransparent: params.has("h")
  };
  const filters: FilterOptions[] = [];
  createStringFilters("text", params.getAll("x"), filters);
  createStringFilters("uid", params.getAll("u"), filters);
  createStringFilters("organizer", params.getAll("o"), filters);
  createStringFilters("email", params.getAll("e"), filters);
  createStringFilters("location", params.getAll("l"), filters);
  
  params.getAll("p").forEach(f => {
    if(!isNaN(parseInt(f.startsWith("!") ? f.slice(1) : f))){
      filters.push({
        type: "priority",
        value: Math.min(Math.max(0, parseInt(decodeURIComponent(f.startsWith("!") ? f.slice(1) : f))), 9),
        invert: f.startsWith("!")
      });
    }
  });
  if (params.has("m") && !isNaN(parseInt(params.get("m") as string))) {
    transformOptions.modifyPriority = Math.min(Math.max(0, parseInt(params.get("m") as string)), 9);
  }
  if (params.has("r")) {
    transformOptions.rename = decodeURIComponent(params.get("r") as string);
  }
  return new Response(file.pipeThrough(new TextDecoderStream()).pipeThrough(transformCalendar(evaluateFilterGroup({
    filters: filters,
    all: params.get("t") === "all" || params.get("t") === "none",
    invert: params.get("t") === "some" || params.get("t") === "none",
  }), transformOptions)).pipeThrough(new TextEncoderStream()), {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": "attachment; filename=" + (transformOptions.rename ? encodeURI(transformOptions.rename as string) + ".ics" : fileName)
    }
  });
}
