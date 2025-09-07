import { ReactNode, useEffect, useState } from "react";
import { CalendarInfo } from "../../src/parseCalendar"
import { FilterGroupOptions, FilterOptions, filterToQueryParam } from "../../src/filter"
import { Filter, PrioritySelect } from "./Filter";
import { AppBar, Button, ButtonGroup, Container, Dialog, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid2 as Grid, IconButton, Stack, Switch, Table, TableContainer, TextField, Toolbar, Tooltip, Typography } from "@mui/material";
import { AutoAwesome as AIIcon, Close as CloseIcon, ContentCopy as CopyIcon, Launch as LaunchIcon } from "@mui/icons-material";
import React from "react";

function CopyButton(props: {text: string, children: ReactNode}) {
  const [copied, setCopied] = useState(false);
  return <Tooltip title="Copied!" open={copied}>
    <Button startIcon={<CopyIcon/>} color="secondary" onClick={() => {
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

function EnableableInput<T>(props: { value: T, default: T, setValue: (value: T | null) => void, label: string, children: ReactNode }) {
  return <Grid container columns={{xs: 5, sm: 7}} columnSpacing={2} sx={{paddingBlockStart: 1, alignItems: "center"}}>
    <Grid size={{xs: 5, sm: 2}}>
      <FormControlLabel control={
        <Switch checked={props.value !== null} onChange={() => {
          if (props.value === null) {
            props.setValue(props.default);
          } else {
            props.setValue(null);
          }
        }} />} label={props.label} />
    </Grid>
    <Grid size={5}>
      {props.children}
    </Grid>
  </Grid>
}

function CalendarOptions(props: {calendar?: CalendarInfo, open: boolean, close: () => void}) {
  const [removeAlarms, setRemoveAlarms] = useState(false);
  const [makeTransparent, setMakeTransparent] = useState<"transparent" | "opaque" | null>(null);
  const [modifyPriority, setModifyPriority] = useState<number | null>(null);
  const [renameCalendar, setRenameCalendar] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState("any");
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [filters, setFilters] = useState<FilterOptions[]>([]);

  useEffect(() => {
    setRemoveAlarms(false);
    setMakeTransparent(null);
    setModifyPriority(null);
    setRenameCalendar(null);
    setFilterMode("any");
    setAiPrompt("");
    setAiMessage("");
    setFilters([{
      id: Math.random(),
      type: "text",
      invert: false,
      value: ""
    }]);
  }, [props.calendar])

  if (!props.calendar) {
    return <Dialog fullScreen open={props.open} sx={{userSelect: "none"}}>
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
  + (makeTransparent === "transparent" ? "&h" : "")
  + (makeTransparent === "opaque" ? "&h=o" : "") 
  + (renameCalendar ? "&r=" + encodeURIComponent(renameCalendar) : "") 
  + (modifyPriority !== null ? "&m=" + modifyPriority : "")
  + (filters.length ? "&" : "")
  + filters.map(filter => filterToQueryParam(filter)).join("&");

  return (
    <>
      <Dialog fullScreen open={props.open} sx={{userSelect: "none"}}>
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
        <Container maxWidth="md" sx={{marginBlockStart: 9, marginBlockEnd: 4}}>
          <Container sx={{marginBlock: 3}}>
            <FormControl component="fieldset" variant="standard" fullWidth>
              <FormLabel component="legend">AI Filter Generator</FormLabel>
              <FormGroup>
                <Stack direction="row">
                  <TextField color="secondary" fullWidth label="Prompt" variant="filled" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} slotProps={{
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
                      fetch("/ai?p=" + encodeURIComponent(aiPrompt)).then(r => r.json()).then((j: {filters?: FilterGroupOptions, error?: string, remainingCalls: number}) => {
                        if (j.error) {
                          setAiMessage(j.error);
                        } else if (j.filters) {
                          j.filters.filters?.forEach(filter => {
                            filter.id = Math.random();
                          })
                          setFilters(j.filters.filters as FilterOptions[]);
                          if (j.filters.all) {
                            setFilterMode(j.filters.invert ? "none" : "all");
                          } else {
                            setFilterMode(j.filters.invert ? "some" : "any");
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
                  <TextField color="secondary" fullWidth select slotProps={{
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
              <FormLabel component="legend" color="secondary">Other Options</FormLabel>
              <FormGroup>
                {props.calendar.hasAlarms ? 
                  (<FormControlLabel
                    control={<Switch
                      checked={removeAlarms}
                      onChange={() => setRemoveAlarms(!removeAlarms)}/>}
                    label="Remove Event Reminders" />)
                : null}
                <EnableableInput<"transparent" | "opaque" | null> default={"transparent"} value={makeTransparent} setValue={setMakeTransparent} label="Modify Event Transparency">
                  <TextField color="secondary" select slotProps={{
                    select: {
                      native: true,
                    },
                  }} variant="filled" label="Transparency" onChange={e => {
                    setMakeTransparent(e.target.value as "transparent" | "opaque");
                  }} value={makeTransparent} disabled={makeTransparent === null}>
                    <option value="transparent">Transparent</option>
                    <option value="opaque">Opaque</option>
                  </TextField>
                </EnableableInput>
                <FormHelperText>
                  Transparent events do not block off space in your calendar, so other events can be created at the same time.
                </FormHelperText>
                <EnableableInput<number | null> default={0} value={modifyPriority} setValue={setModifyPriority} label="Modify Event Priority">
                  <PrioritySelect value={modifyPriority as number} label="Priority" disabled={modifyPriority === null} onChange={e => {
                    setModifyPriority(parseInt(e.target.value));
                  }} />
                </EnableableInput>
                <EnableableInput<string | null> value={renameCalendar} setValue={setRenameCalendar} default="" label="Rename Calendar">
                  <TextField color="secondary" type="text" label="Name" variant="filled" value={renameCalendar} disabled={renameCalendar === null} onChange={e => {
                    setRenameCalendar(e.target.value);
                  }} />
                </EnableableInput>
              </FormGroup>
            </FormControl>
          </Container>
          <Container sx={{marginBlock: 3}}>
            <FormControl component="fieldset" variant="standard" fullWidth>
              <FormLabel component="legend">Your Filtered Calendar</FormLabel>
              <FormGroup>
                <TextField color="secondary" fullWidth type="text" slotProps={{input: {readOnly: true}}} value={"https://" + calendarUrl} />
                <ButtonGroup sx={{paddingBlockStart: 1}}>
                  <CopyButton text={"https://" + calendarUrl}>
                    Copy Address
                  </CopyButton>
                  <Button endIcon={<LaunchIcon/>} color="secondary" href={"webcal://" + calendarUrl} target="_blank" sx={{color: "secondary"}}>
                    Open in Default Calendar App
                  </Button>
                </ButtonGroup>
              </FormGroup>
            </FormControl>
          </Container>
        </Container>
      </Dialog>
  </>
  )
}

export default CalendarOptions;