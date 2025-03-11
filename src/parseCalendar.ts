export type CalendarInfo = {
  name: string,
  hasAlarms: boolean,
  hasPriority: boolean,
  hasOpaque: boolean,
  hasText: boolean,
  events: Map<string, string>,
  locations: Set<string>,
  organizers: Set<string>,
  emails: Set<string>
  url?: string
}

export function parseCalendar () {
  var lineBuffer = "";
  var lineEnd = false;
  var inEvent = false;
  var event = "";
  var eventSummary: string | null = null;
  var eventUid: string | null = null;
  var calendarInfo: CalendarInfo = {
    name: "Calendar",
    hasAlarms: false,
    hasPriority: false,
    hasOpaque: false,
    hasText: false,
    events: new Map(),
    locations: new Set(),
    organizers: new Set(),
    emails: new Set()
  };

  function handleLine (line: string) {
    if (inEvent) {
      event += line + "\r\n";
      if (line === "END:VEVENT") {
        if (eventSummary && eventUid) {
          calendarInfo.events.set(eventUid, eventSummary);
        }
        inEvent = false;
      } else if (line.startsWith("SUMMARY:") && line.length > 8) {
        calendarInfo.hasText = true;
        eventSummary = line.slice(8).trim();
      } else if (line.startsWith("DESCRIPTION:") && line.length > 12) {
        calendarInfo.hasText = true;
      } else if (line.startsWith("UID:") && line.length > 4) {
        eventUid = line.slice(4);
      } else if (line.startsWith("LOCATION:") && line.length > 9) {
        calendarInfo.locations.add(line.slice(9).trim());
      } else if (line.startsWith("ORGANIZER")) {
        if (line.includes("CN=")) {
          const nameStart = line.indexOf("CN=") + 3;
          const nameEnd = Math.max(line.indexOf(":", nameStart), line.indexOf(";", nameStart));
          calendarInfo.organizers.add(line.slice(nameStart, nameEnd < nameStart ? Infinity : nameEnd));
        }
        if (line.includes("MAILTO:")) {
          const emailStart = line.indexOf("MAILTO:") + 7;
          const emailEnd = Math.max(line.indexOf(":", emailStart), line.indexOf(";", emailStart));
          calendarInfo.emails.add(line.slice(emailStart, emailEnd < emailStart ? Infinity : emailEnd));
        }
      } else if (line.startsWith("PRIORITY:")) {
        calendarInfo.hasPriority = true;
      } else if (line === "BEGIN:VALARM" || line === "END:VALARM") {
        calendarInfo.hasAlarms = true;
      } else if (line.startsWith("TRANSP:OPAQUE")) {
        calendarInfo.hasOpaque = true;
      }
    } else if (line === "BEGIN:VEVENT") {
      event = line + "\r\n";
      eventSummary = null;
      eventUid = null;
      inEvent = true;
    } else if (line.startsWith("X-WR-CALNAME:") && line.length > 13) {
      calendarInfo.name = line.slice(13).trim();
    }
  }

  return new TransformStream<string, string>({
    transform (chunk: string) {
      chunk.split("").forEach(char => {
        if (char === "\r") {
          return;
        }
        if (lineEnd) {
          lineEnd = false;
          if (!(char === " " || char === "\t")) {
            handleLine(lineBuffer);
            lineBuffer = char; 
          }
        } else if (char === "\n") {
          lineEnd = true;
        } else {
          lineBuffer += char;
        }
      });
    },
    flush (controller: TransformStreamDefaultController<string>) {
      if (lineBuffer.length) {
        handleLine(lineBuffer);
      }
      controller.enqueue(JSON.stringify(calendarInfo, (_key: string, value: any) => {
        if (value instanceof Set) {
          return Array.from(value);
        } else if (value instanceof Map) {
          return Object.fromEntries(value);
        }
        return value;
      }));
      controller.terminate();
    }
  });
}