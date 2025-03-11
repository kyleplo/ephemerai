import { useRef, useState } from "react";
import { CalendarInfo } from "../../src/parseCalendar";

export function FetchCalendar(props: {setCalendar: (calendar: CalendarInfo) => void}) {
  const [error, setError] = useState<string>("");
  const urlInput = useRef<HTMLInputElement>(null);
  if (error === "loading") {
    return <p>Loading...</p>
  }
  return <>
    {error.length ? <p>{error}</p> : null}
    <input type="url" ref={urlInput}></input>
    <button onClick={() => {
      if (!urlInput.current) {
        return;
      }
      setError("loading");
      try {
        const url = urlInput.current?.value;
        fetch("/parse?c=" + encodeURIComponent(url)).then(r => r.text()).then(t => {
          const j = JSON.parse(t, (key: string, value: any) => {
            if (key === "locations" || key === "organizer" || key === "emails") {
              return new Set(value);
            }
            if (key === "events") {
              return new Map(Object.entries(value));
            }
            return value;
          });
          if (j.error) {
            setError(j.error);
          } else {
            const calendarInfo = j as CalendarInfo;
            calendarInfo.url = url;
            setError("");
            props.setCalendar(calendarInfo);
          }
        });
      } catch (_e) {
        setError("Failed to Fetch Calendar");
      }
    }}>Filter Calendar</button>
  </>
}