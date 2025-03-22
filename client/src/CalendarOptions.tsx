import { ReactNode, useEffect, useState } from "react";
import { CalendarInfo } from "../../src/parseCalendar"
import { FilterGroupOptions, FilterOptions, filterToQueryParam } from "../../src/filter"
import { Filter, PrioritySelect } from "./Filter";
import { AppBar, Button, ButtonGroup, Container, Dialog, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, Stack, Switch, Table, TableContainer, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { AutoAwesome as AIIcon, Close as CloseIcon, ContentCopy as CopyIcon, Launch as LaunchIcon } from "@mui/icons-material";

function CopyButton(props: {text: string, children: ReactNode}) {
  const [copied, setCopied] = useState(false);
  return <Tooltip title="Copied!" open={copied}>
    <Button startIcon={<CopyIcon/>} onClick={() => {
      navigator.clipboard.writeText(props.text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 3000);
    }}>
      {props.children}
    </Button>
  </Tooltip>;
}

function EnableableInput(props: { value: string | number | null, setValue: (enabled: any) => void, inputType: string, inputMax?: number, inputMin?: number, defaultValue?: any, label: string, inputLabel?: string }) {
  return <>
    <FormControlLabel control={
      <Switch checked={props.value !== null} onChange={() => {
        if (props.value === null) {
          props.setValue("");
        } else {
          props.setValue(null);
        }
      }} />} label={props.label} />
    {props.inputType === "number" ?
      <PrioritySelect value={props.value || undefined} label={props.inputLabel || props.label} disabled={props.value === null} onChange={e => {
        props.setValue(e.target.value);
      }} /> :
      <TextField type={props.inputType} label={props.inputLabel || props.label} variant="filled" value={props.value || undefined} disabled={props.value === null} onChange={e => {
        props.setValue(e.target.value);
      }} />}
  </>;
}

function CalendarOptions(props: {calendar?: CalendarInfo, open: boolean, close: () => void}) {
  const [removeAlarms, setRemoveAlarms] = useState(false);
  const [makeTransparent, setMakeTransparent] = useState(false);
  const [modifyPriority, setModifyPriority] = useState<number | null>(null);
  const [renameCalendar, setRenameCalendar] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState("any");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [filters, setFilters] = useState<FilterOptions[]>([]);

  useEffect(() => {
    setRemoveAlarms(false);
    setMakeTransparent(false);
    setModifyPriority(null);
    setRenameCalendar(null);
    setFilterMode("any");
    setAiPrompt("");
    setAiMessage("");
    setFilters([]);
  }, [props.calendar])

  if (!props.calendar) {
    return <Dialog fullScreen open={props.open}>
      <AppBar>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={props.close} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            No Calendar Selected
          </Typography>
        </Toolbar>
      </AppBar>
    </Dialog>
  }

  const calendarUrl = location.host + "/filter?c="
  + encodeURIComponent(props.calendar.url as string)
  + "&t=" + filterMode
  + (removeAlarms ? "&a" : "")
  + (makeTransparent ? "&h" : "") 
  + (renameCalendar ? "&r=" + encodeURIComponent(renameCalendar) : "") 
  + (modifyPriority ? "&m=" + modifyPriority : "")
  + "&" + filters.map(filter => filterToQueryParam(filter)).join("&");

  return (
    <Dialog fullScreen open={props.open}>
      <AppBar>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={props.close} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Filter {props.calendar.name}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{marginBlockStart: 9, marginBlockEnd: 9}}>
        <Container sx={{marginBlock: 3}}>
          <FormControl component="fieldset" variant="standard" fullWidth>
            <FormLabel component="legend">AI Filter Generator</FormLabel>
            <FormGroup>
            <Stack direction="row">
              <TextField fullWidth label="Prompt" variant="filled" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} slotProps={{
                input: {
                  readOnly: aiMessage === "loading"
                }
              }} error={aiMessage.length > 0 && aiMessage !== "loading"} helperText={aiMessage === "loading" ? null : aiMessage} sx={{
                flexDirection: "row",
                paddingRight: 1
              }}/>
                <Button startIcon={<AIIcon fontSize="small" />} loading={aiMessage === "loading"} onClick={() => {
                  setAiMessage("loading");
                  try {
                    fetch("/ai?p=" + encodeURIComponent(aiPrompt)).then(r => r.json()).then((j: FilterGroupOptions & { error?: string}) => {
                      if (j.error) {
                        setAiMessage(j.error);
                      } else {
                        j.filters?.forEach(filter => {
                          filter.id = Math.random();
                        })
                        setFilters(j.filters as FilterOptions[]);
                        if (j.all) {
                          setFilterMode(j.invert ? "none" : "all");
                        } else {
                          setFilterMode(j.invert ? "some" : "any");
                        }
                        setAiMessage("");
                      }
                    });
                  } catch (_e) {
                    setAiMessage("Failed to Generate Filters");
                  }
                }} sx={{minWidth: "30%!important"}} variant="contained">Generate Filters</Button>
              </Stack>
            </FormGroup>
            <FormHelperText>AI can make mistakes. Always review any filters generated by AI.</FormHelperText>
          </FormControl>
        </Container>
        <Container sx={{marginBlockStart: 3}}>
          <FormControl component="fieldset" variant="standard" fullWidth>
            <FormLabel component="legend">Filters</FormLabel>
            <FormGroup>
              <Stack direction="row">
                <TextField fullWidth select slotProps={{
                  select: {
                    native: true,
                  },
                }} label="Filter Mode" variant="filled" defaultValue="any" value={filterMode} onChange={e => {
                  setFilterMode(e.target.value);
                }} sx={{
                  flexDirection: "row",
                  paddingRight: 1
                }}>
                  <option value="any">Keep Event If Any Filter Matches</option>
                  <option value="all">Keep Event If All Filters Match</option>
                  <option value="some">Discard Event If Any Filter Matches</option>
                  <option value="none">Discard Event If All Filters Match</option>
                </TextField>
                <Button onClick={() => {
                  setFilters(filters.concat([{
                    id: Math.random(),
                    type: "text",
                    invert: false,
                    value: ""
                  }]));
                }} sx={{minWidth: "30%!important"}} variant="contained">
                  Add New Filter
                </Button>
              </Stack>
            </FormGroup>
          </FormControl>
        </Container>
        <TableContainer>
          <Table>
            {filters.map(filter => <Filter key={filter.id} filter={filter} filters={filters} setFilters={setFilters} calendar={props.calendar as CalendarInfo}></Filter>)}
          </Table>
        </TableContainer>
        <Container sx={{marginBlock: 3}}>
          <FormControl component="fieldset" variant="standard" fullWidth>
            <FormLabel component="legend">Other Options</FormLabel>
            <FormGroup>
              {props.calendar.hasAlarms ? 
                (<FormControlLabel
                  control={<Switch
                    checked={removeAlarms}
                    onChange={() => setRemoveAlarms(!removeAlarms)}/>}
                  label="Remove Event Reminders" />)
              : null}
              <FormControlLabel
              control={<Switch
                checked={makeTransparent}
                onChange={() => setMakeTransparent(!makeTransparent)}/>}
              label="Mark All Events as Transparent" />
              <FormHelperText>
                Transparent events do not block off space in your calendar, so other events can be created at the same time.
              </FormHelperText>
              <EnableableInput value={modifyPriority} setValue={setModifyPriority} inputType="number" inputMin={0} inputMax={9} label="Modify Event Priority" inputLabel="Priority" />
              <EnableableInput value={renameCalendar} setValue={setRenameCalendar} inputType="text" defaultValue={props.calendar.name} label="Rename Calendar" inputLabel="Name" />
            </FormGroup>
          </FormControl>
        </Container>
        <Container sx={{marginBlock: 3}}>
          <FormControl component="fieldset" variant="standard" fullWidth>
            <FormLabel component="legend">Your Filtered Calendar</FormLabel>
            <FormGroup>
              <TextField fullWidth type="text" slotProps={{input: {readOnly: true}}} value={"https://" + calendarUrl} />
              <ButtonGroup sx={{paddingBlockStart: 1}}>
                <CopyButton text={"https://" + calendarUrl}>
                  Copy Link
                </CopyButton>
                <Button endIcon={<LaunchIcon/>} href={"webcal://" + calendarUrl} target="_blamk">
                  Open in Default Calendar App
                </Button>
              </ButtonGroup>
            </FormGroup>
          </FormControl>
        </Container>
      </Container>
    </Dialog>
  )
}

export default CalendarOptions;