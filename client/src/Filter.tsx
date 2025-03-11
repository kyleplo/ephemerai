import { CalendarInfo } from "../../src/parseCalendar"
import { FilterOptions } from "../../src/filter"

export function Filter(props: {filter: FilterOptions, filters: FilterOptions[], setFilters: (filters: FilterOptions[]) => void, calendar: CalendarInfo}) {
  const filter = props.filter;
  return <li>
    <label>
      Filter events where the
      <select onChange={e => {
        props.setFilters(props.filters.map(oldFilter => {
          if (oldFilter.id === filter.id) {
            return {
              id: filter.id,
              type: e.target.value as "text" | "uid" | "organizer" | "email" | "location" | "priority",
              value: "",
              invert: false
            }
          }
          return oldFilter;
        }));
      }} value={filter.type}>
        {props.calendar.hasText ? <option value="text">Text</option> : null}
        {props.calendar.events.size > 0 ? <option value="uid">Event</option> : null}
        {props.calendar.organizers.size > 0 ? <option value="organizer">Organizers</option> : null}
        {props.calendar.emails.size > 0 ? <option value="email">Organizer emails</option> : null}
        {props.calendar.locations.size > 0 ? <option value="location">Location</option> : null}
        {props.calendar.hasPriority ? <option value="priority">Priority</option> : null}
      </select>
    </label>
    <label>
      is
      <select onChange={e => {
        props.setFilters(props.filters.map(oldFilter => {
          if (oldFilter.id === filter.id) {
            return {
              id: filter.id,
              type: filter.type,
              value: filter.value,
              invert: e.target.value === "invert"
            }
          }
          return oldFilter;
        }));
      }} value={filter.invert ? "invert" : "normal"}>
        <option value="normal">{filter.type === "uid" ? "equal to" : filter.type === "priority" ? "at least" : "including"}</option>
        <option value="invert">{filter.type === "uid" ? "not" : filter.type === "priority" ? "less than" : "not including"}</option>
      </select>
    </label>
    <label>
      the value
      {filter.type === "priority" ? (
        <input type="number" value={filter.value} min="0" max="9" onChange={e => {
          props.setFilters(props.filters.map(oldFilter => {
            if (oldFilter.id === filter.id) {
              return {
                id: filter.id,
                type: filter.type,
                value: e.target.valueAsNumber,
                invert: filter.invert
              }
            }
            return oldFilter;
          }));
        }}></input>
      ) : filter.type === "uid" ? (
        <select value={filter.value}  onChange={e => {
          props.setFilters(props.filters.map(oldFilter => {
            if (oldFilter.id === filter.id) {
              return {
                id: filter.id,
                type: filter.type,
                value: e.target.value,
                invert: filter.invert
              }
            }
            return oldFilter;
          }));
        }}>
          {Array.from(props.calendar.events.entries()).map(event => {
            return (<option value={event[0]} key={event[0]}>{event[1]}</option>)
          })}
        </select>
      ) : (
        <input type="text" value={filter.value} onChange={e => {
          props.setFilters(props.filters.map(oldFilter => {
            if (oldFilter.id === filter.id) {
              return {
                id: filter.id,
                type: filter.type,
                value: e.target.value,
                invert: filter.invert
              }
            }
            return oldFilter;
          }));
        }} list={filter.type === "location" ? "locations" : filter.type === "email" ? "emails" : filter.type === "organizer" ? "organizers" : undefined}></input>
      )}
    </label>
    <button onClick={() => {
      props.setFilters(props.filters.filter(oldFilter => {
        return oldFilter.id !== filter.id;
      }))
    }}>
      Delete Filter
    </button>
  </li>
}