import { useState } from "react";
import { CalendarInfo } from "../../src/parseCalendar";
import { Button, ButtonGroup, TextField } from "@mui/material";
import { PropsOf } from "@emotion/react";

export function FetchCalendar(props: { setCalendar: (calendar: CalendarInfo) => void; } & PropsOf<typeof ButtonGroup>) {
  const [error, setError] = useState<string>("");
  const [calendarUrl, setCalendarUrl] = useState<string>("");
  return <ButtonGroup variant="contained" {...props}>
    <TextField type="url" value={calendarUrl} label="Calendar Address" variant="filled" onChange={e => {
      setCalendarUrl(e.target.value.replaceAll("webcal://", "https://").replaceAll("http://", "https://"));
      setError("");
    }} error={error.length > 0 && error !== "loading"} helperText={error === "loading" ? null : error} slotProps={{
      input: {
        readOnly: error === "loading"
      }
    }} />
    <Button loading={error === "loading"} onClick={() => {
      setError("loading");
      try {
        fetch("/parse?c=" + encodeURIComponent(calendarUrl)).then(r => r.text()).then(t => {
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
            calendarInfo.url = calendarUrl;
            setError("");
            props.setCalendar(calendarInfo);
          }
        });
      } catch (_e) {
        setError("Failed to Fetch Calendar");
      }
    }}>Filter Calendar</Button>
  </ButtonGroup>
};