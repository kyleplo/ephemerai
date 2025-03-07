import { EventData } from "./transformCalendar";

export type FilterOptions = {
  type?: "text" | "uid" | "organizer" | "email" | "location" | "priority",
  value?: string | number,
  invert?: boolean
}

const defaultFilterOptions: FilterOptions = {
  type: "text",
  value: "",
  invert: false
}

type FilterGroupOptions = {
  filters?: FilterOptions[],
  all?: boolean,
  invert?: boolean
}

const defaultFilterGroupOptions: FilterGroupOptions = {
  filters: [],
  all: false,
  invert: false
}

export function evaluateFilter(inputOptions: FilterOptions, event: EventData): boolean {
  const options = Object.assign({}, defaultFilterOptions, inputOptions);
  switch (options.type) {
    case "email":
      return typeof options.value === "string" && event.organizerEmails.includes(options.value.toLowerCase());
    case "location":
      return typeof options.value === "string" && event.location !== undefined && event.location.toLowerCase().includes(options.value.toLowerCase());
    case "organizer":
      return typeof options.value === "string" && event.organizerNames.includes(options.value.toLowerCase());
    case "priority":
      return typeof options.value === "number" && event.priority !== undefined && event.priority >= options.value;
    case "text":
      return typeof options.value === "string" && event.text !== undefined && event.text.toLowerCase().includes(options.value.toLowerCase());
    case "uid":
      return typeof options.value === "string" && event.uid === options.value;
  }
  return false;
}

export function evaluateFilterGroup(inputOptions: FilterGroupOptions): (event: EventData) => boolean {
  const options = Object.assign({}, defaultFilterGroupOptions, inputOptions);
  return function (event: EventData): boolean {
    if (!options.filters) {
      return false;
    }
    var anyFail = false;
    for (const filter of options.filters) {
      var filterResult = evaluateFilter(filter, event);
      if (filter.invert) {
        filterResult = !filterResult;
      }
      if (!filterResult) {
        anyFail = true;
      }
      
      if (filterResult && !options.all) {
        return !options.invert;
      } else if (!filterResult && options.all) {
        return !!options.invert;
      }
    }

    if (options.invert) {
      anyFail = !anyFail;
    }
    return !anyFail;
  };
}