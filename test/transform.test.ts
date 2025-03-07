import { test, expect } from "vitest";
import { transformCalendar } from "../src/transformCalendar";
import { outputStream } from "./outputStream";

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
GEO:48.85299;2.36885
END:VEVENT
END:VCALENDAR
`;

test("filter out all", async () => {
  const inputStream = new ReadableStream<string>({
    start (controller: ReadableStreamDefaultController<string>) {
      controller.enqueue(simple);
      controller.close();
    }
  });
  const [stream, output] = outputStream();
  inputStream.pipeThrough(transformCalendar(() => false)).pipeTo(stream);
  expect(await output).toEqual(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
END:VCALENDAR
`.replaceAll("\n", "\r\n"));
});

test("filter out none", async () => {
  const inputStream = new ReadableStream<string>({
    start (controller: ReadableStreamDefaultController<string>) {
      controller.enqueue(simple);
      controller.close();
    }
  });
  const [stream, output] = outputStream();
  inputStream.pipeThrough(transformCalendar(() => true)).pipeTo(stream);
  expect(await output).toEqual(simple.replaceAll("\n", "\r\n"));
});

test("simple event data", async () => {
  const inputStream = new ReadableStream<string>({
    start (controller: ReadableStreamDefaultController<string>) {
      controller.enqueue(simple);
      controller.close();
    }
  });
  var data;
  const [stream, output] = outputStream();
  await inputStream.pipeThrough(transformCalendar(d => {
    data = d;
    return true;
  })).pipeTo(stream);
  expect(data).toEqual({
    organizerNames: [ 'john doe' ],
    organizerEmails: [ 'john.doe@example.com' ],
    uid: 'uid1@example.com',
    text: 'bastille day party'
  });
});

test("random chunks", async () => {
  const inputStream = new ReadableStream<string>({
    start (controller: ReadableStreamDefaultController<string>) {
      var i = 0;
      while (i < simple.length) {
        const r = Math.floor(Math.random() * 50) + 1;
        controller.enqueue(simple.slice(i, i + r));
        i += r;
      }
      controller.close();
    }
  });
  var data;
  const [stream, output] = outputStream();
  inputStream.pipeThrough(transformCalendar(d => {
    data = d;
    return true;
  })).pipeTo(stream);
  expect(await output).toEqual(simple.replaceAll("\n", "\r\n"));
  expect(data).toEqual({
    organizerNames: [ 'john doe' ],
    organizerEmails: [ 'john.doe@example.com' ],
    uid: 'uid1@example.com',
    text: 'bastille day party'
  });
});

test("make transparent", async () => {
  const inputStream = new ReadableStream<string>({
    start (controller: ReadableStreamDefaultController<string>) {
      controller.enqueue(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
BEGIN:VEVENT
UID:uid1@example.com
ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com
TRANSP:OPAQUE
DTSTAMP:19970701T100000Z
DTSTART:19970714T170000Z
DTEND:19970715T040000Z
SUMMARY:Bastille Day Party
GEO:48.85299;2.36885
END:VEVENT
END:VCALENDAR
`.replaceAll("\n", "\r\n"));
      controller.close();
    }
  });
  const [stream, output] = outputStream();
  inputStream.pipeThrough(transformCalendar(() => true, {
    makeTransparent: true
  })).pipeTo(stream);
  expect(await output).toEqual(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
BEGIN:VEVENT
UID:uid1@example.com
ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com
DTSTAMP:19970701T100000Z
DTSTART:19970714T170000Z
DTEND:19970715T040000Z
SUMMARY:Bastille Day Party
GEO:48.85299;2.36885
TRANSP:TRANSPARENT
END:VEVENT
END:VCALENDAR
`.replaceAll("\n", "\r\n"));
});

test("modify priority - has priority", async () => {
  const inputStream = new ReadableStream<string>({
    start (controller: ReadableStreamDefaultController<string>) {
      controller.enqueue(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
BEGIN:VEVENT
UID:uid1@example.com
ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com
PRIORITY:5
DTSTAMP:19970701T100000Z
DTSTART:19970714T170000Z
DTEND:19970715T040000Z
SUMMARY:Bastille Day Party
GEO:48.85299;2.36885
END:VEVENT
END:VCALENDAR
`.replaceAll("\n", "\r\n"));
      controller.close();
    }
  });
  const [stream, output] = outputStream();
  inputStream.pipeThrough(transformCalendar(() => true, {
    modifyPriority: 2
  })).pipeTo(stream);
  expect(await output).toEqual(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
BEGIN:VEVENT
UID:uid1@example.com
ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com
DTSTAMP:19970701T100000Z
DTSTART:19970714T170000Z
DTEND:19970715T040000Z
SUMMARY:Bastille Day Party
GEO:48.85299;2.36885
PRIORITY:2
END:VEVENT
END:VCALENDAR
`.replaceAll("\n", "\r\n"));
});

test("modify priority - no priority", async () => {
  const inputStream = new ReadableStream<string>({
    start (controller: ReadableStreamDefaultController<string>) {
      controller.enqueue(simple);
      controller.close();
    }
  });
  const [stream, output] = outputStream();
  inputStream.pipeThrough(transformCalendar(() => true, {
    modifyPriority: 2
  })).pipeTo(stream);
  expect(await output).toEqual(`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
BEGIN:VEVENT
UID:uid1@example.com
ORGANIZER;CN=John Doe:MAILTO:john.doe@example.com
DTSTAMP:19970701T100000Z
DTSTART:19970714T170000Z
DTEND:19970715T040000Z
SUMMARY:Bastille Day Party
GEO:48.85299;2.36885
PRIORITY:2
END:VEVENT
END:VCALENDAR
`.replaceAll("\n", "\r\n"));
});

test("remove alarm", async () => {
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
`.replaceAll("\n", "\r\n"));
      controller.close();
    }
  });
  const [stream, output] = outputStream();
  await inputStream.pipeThrough(transformCalendar(() => true, {
    removeAlarms: true
  })).pipeTo(stream);
  expect(await output).toEqual(simple.replaceAll("\n", "\r\n"));
});