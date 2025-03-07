export type EventData = {
  text?: string,
  uid?: string,
  organizerNames: string[],
  organizerEmails: string[],
  location?: string
  priority?: number
}
export type TransformOptions = {
  removeAlarms?: boolean,
  makeTransparent?: boolean,
  modifyPriority?: number,
  rename?: string
}
const defaultTransformOptions = {
  removeAlarms: false,
  makeTransparent: false
};

export function transformCalendar (filter: (event: EventData) => boolean, transform: TransformOptions = defaultTransformOptions) {
  var lineBuffer = "";
  var lineEnd = false;
  var inEvent = false;
  var inAlarm = false;
  var event = "";
  var eventData: EventData = {
    organizerNames: [],
    organizerEmails: [],
  };

  function handleLine (line: string, enqueue: (chunk: string) => void, filter: (event: EventData) => boolean, transform: TransformOptions) {
    if (inEvent) {
      if (line === "END:VEVENT") {
        if (transform.makeTransparent) {
          event += "TRANSP:TRANSPARENT\r\n";
        } else if (transform.modifyPriority) {
          eventData.priority = transform.modifyPriority;
          event += "PRIORITY:" + transform.modifyPriority + "\r\n";
        }
      }
      if (!(transform.makeTransparent && line === "TRANSP:OPAQUE") && !(inAlarm || line.startsWith("BEGIN:VALARM") || line.startsWith("END:VALARM")) && !(line.startsWith("PRIORITY:") && transform.modifyPriority)) {
        event += line + "\r\n";
      }
      if (line === "END:VEVENT") {
        inEvent = false;
        if (filter(eventData)) {
          enqueue(event);
        }
      } else if (transform.removeAlarms && line === "BEGIN:VALARM") {
        inAlarm = true;
      } else if (transform.removeAlarms && line === "END:VALARM") {
        inAlarm = false;
      } else if (line.startsWith("SUMMARY:")) {
        eventData.text = (eventData.text ? eventData.text + " " : "") + line.slice(8).toLowerCase();
      } else if (line.startsWith("DESCRIPTION:")) {
        eventData.text = (eventData.text ? eventData.text + " " : "") + line.slice(12).toLowerCase();
      } else if (line.startsWith("UID:")) {
        eventData.uid = line.slice(4);
      } else if (line.startsWith("LOCATION:")) {
        eventData.location = line.slice(9).toLowerCase();
      } else if (line.startsWith("ORGANIZER")) {
        if (line.includes("CN=")) {
          const nameStart = line.indexOf("CN=") + 3;
          const nameEnd = Math.max(line.indexOf(":", nameStart), line.indexOf(";", nameStart));
          eventData.organizerNames.push(line.slice(nameStart, nameEnd < nameStart ? Infinity : nameEnd).toLowerCase());
        }
        if (line.includes("MAILTO:")) {
          const emailStart = line.indexOf("MAILTO:") + 7;
          const emailEnd = Math.max(line.indexOf(":", emailStart), line.indexOf(";", emailStart));
          eventData.organizerEmails.push(line.slice(emailStart, emailEnd < emailStart ? Infinity : emailEnd).toLowerCase());
        }
      } else if (line.startsWith("PRIORITY:")) {
        if (!transform.modifyPriority) {
          eventData.priority = parseInt(line.slice(9));
        }
      }
    } else {
      if (line === "BEGIN:VEVENT") {
        event = line + "\r\n";
        eventData = {
          organizerNames: [],
          organizerEmails: []
        }
        inEvent = true;
      } else if (transform.rename && line.startsWith("X-WR-CALNAME:")) {
        enqueue("X-WR-CALNAME:" + transform.rename.replaceAll("\n", " ").replaceAll("\r", " ") + "\r\n");
      } else {
        enqueue(line + "\r\n");
      }
    }
  }

  return new TransformStream<string, string>({
    transform (chunk: string, controller: TransformStreamDefaultController<string>) {
      chunk.split("").forEach(char => {
        if (char === "\r") {
          return;
        }
        if (lineEnd) {
          lineEnd = false;
          if (!(char === " " || char === "\t")) {
            handleLine(lineBuffer, (chunk: string) => {
              controller.enqueue(chunk);
            }, filter, Object.assign({}, defaultTransformOptions, transform));
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
        handleLine(lineBuffer, (chunk: string) => {
          controller.enqueue(chunk);
        }, filter, Object.assign({}, defaultTransformOptions, transform));
      }
      controller.terminate();
    }
  });
}