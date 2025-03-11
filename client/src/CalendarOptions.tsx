import { ReactNode, useRef, useState } from "react";
import { CalendarInfo } from "../../src/parseCalendar"
import { FilterOptions, filterToQueryParam } from "../../src/filter"
import { Filter } from "./Filter";

function EnableableInput(props: {value: string | number | null, setValue: (enabled: any) => void, children: ReactNode, inputType: string, inputMax?: number, inputMin?: number, defaultValue?: any }) {
  const input = useRef<HTMLInputElement>(null);
  return <p>
    <label>
      <input type="checkbox" checked={props.value !== null} onChange={() => {
        if (props.value === null) {
          props.setValue(props.defaultValue || "");
          setTimeout(() => input.current?.focus());
        } else {
          props.setValue(null);
        }
      }}></input>
        {props.children}
      </label>
      <label>
        to
        <input type={props.inputType} value={props.value || undefined} min={props.inputMin} max={props.inputMax}  ref={input} placeholder={props.defaultValue} onChange={e => {
          props.setValue(props.inputType === "number" ? e.target.valueAsNumber : e.target.value);
        }}></input>
      </label>
    </p>
}

function CalendarOptions(props: {calendar: CalendarInfo}) {
  const [removeAlarms, setRemoveAlarms] = useState(false);
  const [makeTransparent, setMakeTransparent] = useState(false);
  const [modifyPriority, setModifyPriority] = useState<number | null>(null);
  const [renameCalendar, setRenameCalendar] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState("any");
  const [filters, setFilters] = useState<FilterOptions[]>([]);
  return (
    <>
      <h2>Filter {props.calendar.name}</h2>
      {props.calendar.hasAlarms ? 
        (<p>
          <label>
            <input type="checkbox" checked={removeAlarms} onChange={() => setRemoveAlarms(!removeAlarms)}></input> Remove Alarms
          </label>
        </p>)
      : null}
      {props.calendar.hasOpaque ? 
        (<p>
          <label>
            <input type="checkbox" checked={makeTransparent} onChange={() => setMakeTransparent(!makeTransparent)}></input> Mark All Events as Transparent
          </label>
        </p>)
      : null}
      <EnableableInput value={modifyPriority} setValue={setModifyPriority} inputType="number" inputMin={0} inputMax={9}>
        Modify Event Priority
      </EnableableInput>
      <EnableableInput value={renameCalendar} setValue={setRenameCalendar} inputType="text" defaultValue={props.calendar.name}>
        Rename Calendar
      </EnableableInput>
      <h3>
        Filters
      </h3>
      <p>
        <label>
          Filter Mode:
          <select value={filterMode} onChange={e => {
            setFilterMode(e.target.value);
          }}>
            <option value="any">Keep Event If Any Filter Matches</option>
            <option value="all">Keep Event If All Filters Match</option>
            <option value="some">Discard Event If Any Filter Matches</option>
            <option value="none">Discard Event If All Filters Match</option>
          </select>
        </label>
        <button onClick={() => {
          setFilters(filters.concat([{
            id: Math.random(),
            type: "text",
            invert: false,
            value: ""
          }]));
        }}>
          Add New Filter
        </button>
      </p>
      <datalist id="locations">
        {Array.from(props.calendar.locations).map(value => (<option value={value} key={value}></option>))}
      </datalist>
      <datalist id="organizers">
        {Array.from(props.calendar.organizers).map(value => (<option value={value} key={value}></option>))}
      </datalist>
      <datalist id="emails">
        {Array.from(props.calendar.emails).map(value => (<option value={value} key={value}></option>))}
      </datalist>
      <ul>
          {filters.map(filter => <Filter key={filter.id} filter={filter} filters={filters} setFilters={setFilters} calendar={props.calendar}></Filter>)}
      </ul>
      <p>
        Your Calendar URL:
        <input type="text" readOnly value={
          location.protocol + "//" + location.host + "/filter?c="
           + encodeURIComponent(props.calendar.url as string)
           + "&t=" + filterMode
           + (removeAlarms ? "&a" : "")
           + (makeTransparent ? "&h" : "") 
           + (renameCalendar ? "&r=" + encodeURIComponent(renameCalendar) : "") 
           + (modifyPriority ? "&m=" + modifyPriority : "")
           + "&" + filters.map(filter => filterToQueryParam(filter)).join("&")
        }></input>
      </p>
    </>
  )
}

export default CalendarOptions;