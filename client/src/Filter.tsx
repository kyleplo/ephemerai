import { CalendarInfo } from "../../src/parseCalendar";
import { FilterOptions } from "../../src/filter";
import { Autocomplete, Button, SxProps, TableCell, TableRow, TextField, Theme } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import React from "react";

export function PrioritySelect(props: {onChange: (event: React.ChangeEvent<HTMLInputElement>) => void, value: string | number | undefined, label: string, sx?: SxProps<Theme>, fullWidth?: boolean, disabled?: boolean}) {
  return <TextField select slotProps={{
    select: {
      native: true,
    },
  }} variant="filled" label={props.label} onChange={props.onChange} value={props.value} sx={props.sx} fullWidth={props.fullWidth} disabled={props.disabled}>
    <option value="0">0 (unprioritized)</option>
    <option value="1">1</option>
    <option value="2">2</option>
    <option value="3">3</option>
    <option value="4">4</option>
    <option value="5">5</option>
    <option value="6">6</option>
    <option value="7">7</option>
    <option value="8">8</option>
    <option value="9">9</option>
  </TextField>
}

export function Filter(props: { filter: FilterOptions, filters: FilterOptions[], setFilters: (filters: FilterOptions[]) => void, calendar: CalendarInfo; }) {
  const filter = props.filter;
  return <TableRow>
    <TableCell sx={{padding: 1}}>
      <TextField select fullWidth slotProps={{
          select: {
            native: true,
          },
        }} variant="filled" label="Property" onChange={e => {
        props.setFilters(props.filters.map(oldFilter => {
          if (oldFilter.id === filter.id) {
            return {
              id: filter.id,
              type: e.target.value as "text" | "uid" | "organizer" | "email" | "location" | "priority",
              value: (e.target.value === "priority" ? 0 : e.target.value === "uid" ? props.calendar.events.keys().next().value : ""),
              invert: false
            };
          }
          return oldFilter;
        }));
      }} value={filter.type}>
        {props.calendar.hasText ? <option value="text">Text</option> : null}
        {props.calendar.events.size > 0 ? <option value="uid">Event</option> : null}
        {props.calendar.organizers.size > 0 ? <option value="organizer">Organizers</option> : null}
        {props.calendar.emails.size > 0 ? <option value="email">Organizer Emails</option> : null}
        {props.calendar.locations.size > 0 ? <option value="location">Location</option> : null}
        {props.calendar.hasPriority ? <option value="priority">Priority</option> : null}
      </TextField>
    </TableCell>
    <TableCell sx={{padding: 1}}>
      <TextField select fullWidth slotProps={{
          select: {
            native: true,
          },
        }} variant="filled" label="Condition" onChange={e => {
        props.setFilters(props.filters.map(oldFilter => {
          if (oldFilter.id === filter.id) {
            return {
              id: filter.id,
              type: filter.type,
              value: filter.value,
              invert: e.target.value === "invert"
            };
          }
          return oldFilter;
        }));
      }} value={filter.invert ? "invert" : "normal"}>
        <option value="normal">{filter.type === "uid" ? "is" : filter.type === "priority" ? "is at least" : "includes"}</option>
        <option value="invert">{filter.type === "uid" ? "is not" : filter.type === "priority" ? "is less than" : "does not include"}</option>
      </TextField>
    </TableCell>
    <TableCell sx={{width: "40%", padding: 1}}>
      {filter.type === "priority" ? (
        <PrioritySelect label="Value" fullWidth value={filter.value} onChange={e => {
          props.setFilters(props.filters.map(oldFilter => {
            if (oldFilter.id === filter.id) {
              return {
                id: filter.id,
                type: filter.type,
                value: parseInt(e.target.value),
                invert: filter.invert
              };
            }
            return oldFilter;
          }));
        }}/>
      ) : filter.type === "uid" ? (
        <TextField select fullWidth slotProps={{
          select: {
            native: true,
          },
        }} variant="filled" label="Value" value={filter.value} onChange={e => {
          props.setFilters(props.filters.map(oldFilter => {
            if (oldFilter.id === filter.id) {
              return {
                id: filter.id,
                type: filter.type,
                value: e.target.value,
                invert: filter.invert
              };
            }
            return oldFilter;
          }));
        }}>
          {Array.from(props.calendar.events.entries()).map(event => {
            return (<option value={event[0]} key={event[0]}>{event[1].replaceAll("\\", "")}</option>);
          })}
        </TextField>
      ) : (
        <Autocomplete freeSolo fullWidth options={Array.from(filter.type === "location" ? props.calendar.locations : filter.type === "email" ? props.calendar.emails : filter.type === "organizer" ? props.calendar.emails : [])}
          renderInput={(params) => <TextField {...params} label="Value" variant="filled" />
          } inputValue={filter.value as string} onInputChange={(_e, value) => {
            props.setFilters(props.filters.map(oldFilter => {
              if (oldFilter.id === filter.id) {
                return {
                  id: filter.id,
                  type: filter.type,
                  value: value as string,
                  invert: filter.invert
                };
              }
              return oldFilter;
            }));
          }} />
      )}
    </TableCell>
    <TableCell sx={{padding: 1}}>
      <Button startIcon={<DeleteIcon />} color="error" variant="contained" onClick={() => {
        props.setFilters(props.filters.filter(oldFilter => {
          return oldFilter.id !== filter.id;
        }));
      }}>
        Delete
      </Button>
    </TableCell>
  </TableRow>;
}