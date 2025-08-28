import { useState } from "react";
import { CalendarInfo } from "../../src/parseCalendar";
import { Button, Link, Stack, TextField, Typography } from "@mui/material";
import React from "react";

export function FetchCalendar(props: { setCalendar: (calendar: CalendarInfo) => void, showTos: () => void, showPrivacy: () => void, sample?: boolean }) {
  const [error, setError] = useState<string>("");
  const [calendarUrl, setCalendarUrl] = useState<string>("");
  return <>
    <Stack direction="row">
      <TextField color="secondary" fullWidth type="url" value={calendarUrl} label="Calendar Address" variant="filled" onChange={e => {
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
      <Button loading={error === "loading"} variant="contained" onClick={async () => {
        setError("loading");
        try {
          const parsedCalendarResponse = await fetch("/parse?c=" + encodeURIComponent(calendarUrl));
          const parsedCalendarText = await parsedCalendarResponse.text();
          const parsedCalendarData = JSON.parse(parsedCalendarText, (key: string, value: any) => {
            if (key === "locations" || key === "organizer" || key === "emails") {
              return new Set(value);
            }
            if (key === "events") {
              return new Map(Object.entries(value));
            }
            return value;
          });
          if (parsedCalendarData.error) {
            setError(parsedCalendarData.error);
          } else {
            const calendarInfo = parsedCalendarData as CalendarInfo;
            calendarInfo.url = calendarUrl;
            setError("");
            props.setCalendar(calendarInfo);
          }
        } catch (_e) {
          setError("Failed to Fetch Calendar");
        }
      }} sx={{minWidth: "30%!important"}}>Start Filtering</Button>
    </Stack>
      {
        props.sample ? <Typography variant="caption">Or <Link sx={{cursor: "pointer", color: "primary.light"}} onClick={() => {
          const url = new URL(location.href);
          url.pathname = "/sample.ics";
          setCalendarUrl(url.href);
          setError("");
        }}>use our sample calendar</Link><br/></Typography> : null
      }
    <Typography variant="caption">By continuing, you agree to our <Link sx={{cursor: "pointer", color: "primary.light"}} onClick={props.showTos}>Terms of Service</Link> and <Link sx={{cursor: "pointer", color: "primary.light"}} onClick={props.showPrivacy}>Privacy Policy</Link>.</Typography>
  </>
};