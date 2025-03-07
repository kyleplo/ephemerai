import { test, expect } from "vitest";
import { outputStream } from "./outputStream";
import { parseCalendar } from "../src/parseCalendar";

const simple = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
BEGIN:VEVENT
UID:uid1@example.com
ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com
DTSTAMP:19970701T100000Z
DTSTART:19970714T170000Z
DTEND:19970715T040000Z
SUMMARY:Bastille Day Party
LOCATION:France
GEO:48.85299;2.36885
END:VEVENT
END:VCALENDAR
`;

test("simple parse", async () => {
  const inputStream = new ReadableStream<string>({
    start (controller: ReadableStreamDefaultController<string>) {
      controller.enqueue(simple);
      controller.close();
    }
  });
  const [stream, output] = outputStream();
  inputStream.pipeThrough(parseCalendar()).pipeTo(stream);
  expect(await output).toEqual(JSON.stringify({
    name: "Calendar",
    hasAlarms: false,
    hasPriority: false,
    hasOpaque: false,
    hasText: true,
    events: {"uid1@example.com": "Bastille Day Party"},
    locations: ["France"],
    organizers: ["John Doe"],
    emails: ["john.doe@example.com"]
  }));
});
