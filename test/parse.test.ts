import { test, expect } from "vitest";
import { outputStream } from "./outputStream";
import { parseCalendar } from "../src/parseCalendar";

test("simple parse", async () => {
  const inputStream = new ReadableStream<string>({
    start (controller: ReadableStreamDefaultController<string>) {
      controller.enqueue(`BEGIN:VCALENDAR
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
`);
      controller.close();
    }
  });
  const [stream, output] = outputStream();
  inputStream.pipeThrough(parseCalendar()).pipeTo(stream);
  expect(await output).toEqual(JSON.stringify({
    name: "Calendar",
    hasAlarms: false,
    hasPriority: false,
    hasTransparency: false,
    hasText: true,
    events: {"uid1@example.com": "Bastille Day Party"},
    locations: ["France"],
    organizers: ["John Doe"],
    emails: ["john.doe@example.com"]
  }));
});

test("no text parse", async () => {
  const inputStream = new ReadableStream<string>({
    start (controller: ReadableStreamDefaultController<string>) {
      controller.enqueue(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
BEGIN:VEVENT
UID:uid1@example.com
ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com
DTSTAMP:19970701T100000Z
DTSTART:19970714T170000Z
DTEND:19970715T040000Z
LOCATION:France
GEO:48.85299;2.36885
END:VEVENT
END:VCALENDAR
`);
      controller.close();
    }
  });
  const [stream, output] = outputStream();
  inputStream.pipeThrough(parseCalendar()).pipeTo(stream);
  expect(await output).toEqual(JSON.stringify({
    name: "Calendar",
    hasAlarms: false,
    hasPriority: false,
    hasTransparency: false,
    hasText: false,
    events: {},
    locations: ["France"],
    organizers: ["John Doe"],
    emails: ["john.doe@example.com"]
  }));
});

test("opaque parse", async () => {
  const inputStream = new ReadableStream<string>({
    start (controller: ReadableStreamDefaultController<string>) {
      controller.enqueue(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
BEGIN:VEVENT
UID:uid1@example.com
ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com
DTSTAMP:19970701T100000Z
DTSTART:19970714T170000Z
DTEND:19970715T040000Z
TRANSP:OPAQUE
SUMMARY:Bastille Day Party
LOCATION:France
GEO:48.85299;2.36885
END:VEVENT
END:VCALENDAR
`);
      controller.close();
    }
  });
  const [stream, output] = outputStream();
  inputStream.pipeThrough(parseCalendar()).pipeTo(stream);
  expect(await output).toEqual(JSON.stringify({
    name: "Calendar",
    hasAlarms: false,
    hasPriority: false,
    hasTransparency: true,
    hasText: true,
    events: {"uid1@example.com": "Bastille Day Party"},
    locations: ["France"],
    organizers: ["John Doe"],
    emails: ["john.doe@example.com"]
  }));
});

test("priority parse", async () => {
  const inputStream = new ReadableStream<string>({
    start (controller: ReadableStreamDefaultController<string>) {
      controller.enqueue(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
BEGIN:VEVENT
UID:uid1@example.com
ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com
DTSTAMP:19970701T100000Z
DTSTART:19970714T170000Z
DTEND:19970715T040000Z
PRIORITY:5
SUMMARY:Bastille Day Party
LOCATION:France
GEO:48.85299;2.36885
END:VEVENT
END:VCALENDAR
`);
      controller.close();
    }
  });
  const [stream, output] = outputStream();
  inputStream.pipeThrough(parseCalendar()).pipeTo(stream);
  expect(await output).toEqual(JSON.stringify({
    name: "Calendar",
    hasAlarms: false,
    hasPriority: true,
    hasTransparency: false,
    hasText: true,
    events: {"uid1@example.com": "Bastille Day Party"},
    locations: ["France"],
    organizers: ["John Doe"],
    emails: ["john.doe@example.com"]
  }));
});

test("alarm parse", async () => {
  const inputStream = new ReadableStream<string>({
    start (controller: ReadableStreamDefaultController<string>) {
      controller.enqueue(`BEGIN:VCALENDAR
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
BEGIN:VALARM
TRIGGER:-PT24H
REPEAT:1
DURATION:PT15M
ACTION:DISPLAY
DESCRIPTION:Reminder
END:VALARM
END:VEVENT
END:VCALENDAR
`);
      controller.close();
    }
  });
  const [stream, output] = outputStream();
  inputStream.pipeThrough(parseCalendar()).pipeTo(stream);
  expect(await output).toEqual(JSON.stringify({
    name: "Calendar",
    hasAlarms: true,
    hasPriority: false,
    hasTransparency: false,
    hasText: true,
    events: {"uid1@example.com": "Bastille Day Party"},
    locations: ["France"],
    organizers: ["John Doe"],
    emails: ["john.doe@example.com"]
  }));
});

test("named calendar parse", async () => {
  const inputStream = new ReadableStream<string>({
    start (controller: ReadableStreamDefaultController<string>) {
      controller.enqueue(`BEGIN:VCALENDAR
VERSION:2.0
X-WR-CALNAME:Parties
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
`);
      controller.close();
    }
  });
  const [stream, output] = outputStream();
  inputStream.pipeThrough(parseCalendar()).pipeTo(stream);
  expect(await output).toEqual(JSON.stringify({
    name: "Parties",
    hasAlarms: false,
    hasPriority: false,
    hasTransparency: false,
    hasText: true,
    events: {"uid1@example.com": "Bastille Day Party"},
    locations: ["France"],
    organizers: ["John Doe"],
    emails: ["john.doe@example.com"]
  }));
});