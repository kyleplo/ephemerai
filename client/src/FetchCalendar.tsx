import { useState } from "react";
import { CalendarInfo } from "../../src/parseCalendar";
import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import React from "react";

export function FetchCalendar(props: { setCalendar: (calendar: CalendarInfo) => void, showTos: () => void, showPrivacy: () => void }) {
  const [error, setError] = useState<string>("");
  const [calendarUrl, setCalendarUrl] = useState<string>("");
  return <>
    <Stack direction="row">
      <TextField fullWidth type="url" value={calendarUrl} label="Calendar Address" variant="filled" onChange={e => {
        setCalendarUrl(e.target.value.replaceAll("webcal://", "https://").replaceAll("http://", "https://"));
        setError("");
      }} error={error.length > 0 && error !== "loading"} helperText={error === "loading" ? null : error} slotProps={{
        input: {
          readOnly: error === "loading"
        },
        inputLabel: {
          shrink: true
        }
      }} sx={{
        flexDirection: "row",
        paddingRight: 1
      }} placeholder="https://example.com/calendar.ics" />
      <Button loading={error === "loading"} variant="contained" onClick={() => {
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
      }} sx={{minWidth: "30%!important"}}>Start Filtering</Button>
    </Stack>
    <Typography variant="caption">By continuing, you agree to our <Link sx={{cursor: "pointer"}} onClick={props.showTos}>Terms of Service</Link> and <Link sx={{cursor: "pointer"}} onClick={props.showPrivacy}>Privacy Policy</Link>.</Typography>
  </>
};