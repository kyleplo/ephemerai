import { PropsWithChildren, useEffect, useState } from 'react';
import CalendarOptions from './CalendarOptions.tsx';
import { CalendarInfo } from '../../src/parseCalendar';
import { FetchCalendar } from './FetchCalendar';
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Container, Toolbar, Typography, Grid2 as Grid, Paper, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button, createTheme, ThemeProvider, CssBaseline, List, ListItem, Chip, FormControlLabel, Switch } from '@mui/material';
import { InfoOutlined as InfoIcon, MoreVert as MoreVertIcon, ExpandMore as ExpandMoreIcon, Place as PlaceIcon, AutoAwesome as AIIcon, Person as PersonIcon, LowPriority as PriorityIcon, Opacity as OpacityIcon, NotificationsOff as NotificationsOffIcon } from '@mui/icons-material';
import { PrivacyPolicy, TOS } from './TOSPrivacyPolicy';
import React from 'react';

const productName = "SecretarAI";
const contactEmail = "secretarai@kyleplo.com";

const theme = createTheme({
  colorSchemes: {
    dark: true,
  }
});

function Demo () {
  const [interactedWithDemo, setInteractedWithDemo] = useState(false);
  const [demoToggle, setDemoToggle] = useState(false);

  useEffect(() => {
    if (interactedWithDemo) {
      return;
    }

    const interval = setInterval(() => {
      setDemoToggle(toggle => !toggle);
    }, 3000);
    return () => {
      clearInterval(interval);
    }
  }, [interactedWithDemo])

  const now = new Date();
  const demoDate = (now.getDay() === 0 || now.getDay() == 6 ? new Date(now.getTime() + 172800000) : now).toLocaleDateString(undefined, {dateStyle: "full"});

  return <div aria-hidden="true">
    <Paper sx={{padding: 3, margin: 3}}>
      <Chip label="Discard Event If Any Filter Matches" />
      <Stack direction="row" spacing={1} sx={{marginTop: 1}}>
        <Chip label='Description includes "canceled"'/>
        <Chip label='Description includes "optional"' sx={{overflow: "hidden"}} />
      </Stack>
      <FormControlLabel
        control={<Switch
          checked={demoToggle}
          onChange={() => {
            setInteractedWithDemo(true);
            setDemoToggle(!demoToggle)
          }}/>}
        label="Enable Filter" />
    </Paper>
    <Paper sx={{padding: 3, margin: 3}}>
      <Stack direction="row" spacing={1}>
        <Typography variant="h6" component="p">{demoDate}</Typography>
        <Chip label={(demoToggle ? 3 : 5) + " events"} color={demoToggle ? "success" : "error"} />
      </Stack>
      <List dense>
        <ListItem>
          <Chip label="9:30 AM - Important Meeting with Joanne" />
        </ListItem>
        <ListItem>
          <Chip label="11:15 AM - Optional Software Training" color={demoToggle ? "error" : "default"} sx={{textDecoration: demoToggle ? "line-through" : "initial"}} />
        </ListItem>
        <ListItem>
          <Chip label="12:20 PM - Team Lunch" />
          <Chip label="12:20 PM - [CANCELED] Lunch with Frank" color={demoToggle ? "error" : "default"} sx={{marginLeft: 1, overflow: "hidden", textDecoration: demoToggle ? "line-through" : "initial"}} />
        </ListItem>
        <ListItem>
          <Chip label="3:45 PM - Check-in with Management" />
        </ListItem>
      </List>
    </Paper>
  </div>
}

function FeaturePaper (props: PropsWithChildren) {
  return <Grid size={1} sx={{display: "flex"}}>
    <Paper>
      <Stack sx={{alignItems: "center", textAlign: "center", paddingBlock: {xs: 4, md: 8}, paddingInline: 4}}>
        {props.children}
      </Stack>
    </Paper>
  </Grid>
}

function App() {
  const [calendar, setCalendar] = useState<CalendarInfo | undefined>(undefined);
  const [showTos, setShowTos] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <ThemeProvider theme={theme} noSsr storageManager={null}>
      <CssBaseline/>
      <AppBar>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {productName}
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{marginBlockStart: 9}} component="section" maxWidth="lg">
        <Grid container columns={{sm: 1, md: 2}}>
          <Grid size={1} sx={{paddingBlock: 8, paddingInline: 5}}>
            <Typography variant="h3" component="h1">Make Your Calendar as Smart as You</Typography>
            <Typography variant="body1">
              Clean up and tweak your calendar calendar subscriptions with AI-assisted filters. Just paste in a calendar subscription address and start filtering.
            </Typography>
            <br/>
            <FetchCalendar setCalendar={setCalendar} showTos={() => setShowTos(true)} showPrivacy={() => setShowPrivacy(true)} />
          </Grid>
          <Grid size={1} sx={{padding: {xs: 2, md: 1}}}>
            <Demo/>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg" sx={{paddingBlock: 3}} component="section">
        <Typography variant="h4" component="h2" sx={{textAlign: "center", padding: 1}}>Features</Typography>
        <Grid container columns={{ xs: 1, sm: 2, md: 3 }} rowSpacing={4} columnSpacing={{ xs: 2, md: 4, lg: 6 }}>
          <FeaturePaper>
            <AIIcon fontSize="large" color="primary"/>
            <Typography variant="h6" component="h3">AI Filter Assistant</Typography>
            <Typography variant="body1">Write your filters in plain language and let our AI turn them into filter rules.</Typography>
          </FeaturePaper>
          <FeaturePaper>
            <PersonIcon fontSize="large" color="primary"/>
            <Typography variant="h6" component="h3">Person Filtering</Typography>
            <Typography variant="body1">Filter events by who is organizing, either by name or email address.</Typography>
          </FeaturePaper>
          <FeaturePaper>
            <PlaceIcon fontSize="large" color="primary"/>
            <Typography variant="h6" component="h3">Location Filtering</Typography>
            <Typography variant="body1">Only show events that do or don't take place at a specified location.</Typography>
          </FeaturePaper>
          <FeaturePaper>
            <NotificationsOffIcon fontSize="large" color="primary"/>
            <Typography variant="h6" component="h3">Reminder Blocking</Typography>
            <Typography variant="body1">If your calendar includes unwanted reminders, remove them with ease.</Typography>
          </FeaturePaper>
          <FeaturePaper>
            <PriorityIcon fontSize="large" color="primary"/>
            <Typography variant="h6" component="h3">Priority Adjustments</Typography>
            <Typography variant="body1">If your calendar has priority levels, you can automatically modify the priority of events.</Typography>
          </FeaturePaper>
          <FeaturePaper>
            <OpacityIcon fontSize="large" color="primary"/>
            <Typography variant="h6" component="h3">Transparency Controls</Typography>
            <Typography variant="body1">For shared calendars, adjust whether events can be scheduled concurrently with other events.</Typography>
          </FeaturePaper>
        </Grid>
      </Container>
      <Container maxWidth="md" sx={{paddingBlock: 3}} component="section">
      <Typography variant="h4" component="h2" sx={{textAlign: "center", padding: 1}}>Frequently Asked Questions</Typography>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">How does {productName} work?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              {productName} sits as a filter between your calendar's source and your calendar app, keeping the events that you want and discarding the ones you don't. The events remain the same in the original calendar, they will only be modified on your end.
            </Typography>
            <Typography variant="body1">
              First, you will need to find your calendar's address and paste it in to {productName}. From there you can use our AI tools to create filters for you, or design the filters yourself. You will then be provided with a new calendar address which you can add to your calendar app.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">Where do I find my calendar's address?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              Any calendar that is available as an ICS / iCal address should be compatible with {productName}. Google Calendar, Apple Calendar, and Outlook Calendar all support this format, as do many other apps.
            </Typography>
            <Typography variant="h6" component="h3">Google Calendar</Typography>
            <Typography variant="body1">
              In the calendar list, press the <MoreVertIcon fontSize="inherit" /> icon next to the calendar you want to get a link for, then select <strong>Settings and Sharing</strong>. Scroll down to the <strong>Integrate Calendar</strong> section, and use the address provided there. You will need to use the secret address if your calendar is not set to public. 
            </Typography>
            <Typography variant="h6" component="h3">Apple Calendar</Typography>
            <Typography variant="body1">
              On iOS, press the <strong>Calendars</strong> button at the bottom of the screen to go to the calendar list, and then press the <InfoIcon fontSize="inherit" /> icon next to the calendar you would like to use. Turn on the <strong>Public Calendar</strong> switch if it isn't on already, and then press <strong>Share Link...</strong> and then <strong>Copy</strong>.
            </Typography>
            <Typography variant="body1">
              On Mac, find your calendar in the calendar list and right-click on it. If there is a <strong>Copy URL to Clipboard</strong> option, use that. If not, select <strong>Sharing Settings</strong> and check the <strong>Public Calendar</strong> option. You should then be able to right-click on the calendar again and see the <strong>Copy URL to Clipboard</strong> option.
            </Typography>
            <Typography variant="h6" component="h3">Outlook Calendar</Typography>
            <Typography variant="body1">
              Navigate to the settings menu and select <strong>Calendar</strong> and then <strong>Shared calendars</strong>. Select the calendar you want to use and make sure the permissions settings are configured to share all details. Then copy the ICS address.
            </Typography>
            <Typography variant="body1">
              Calendar addresses cannot be exported from Outlook Calendar on mobile at the time of writing.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">How do I add the filtered calendar to my calendar app?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              If you have a default calendar app configured on your device, you should be able to use the <strong>Open in Default Calendar</strong> button to quickly add your filtered calendar. If not, methods vary depending on your calendar app:
            </Typography>
            <Typography variant="h6" component="h3">Google Calendar</Typography>
            <Typography variant="body1">
              Open the settings menu and select <strong>Add calendar</strong> and then <strong>From URL</strong>. Paste in your calendar's address and press <strong>Add calendar</strong>
            </Typography>
            <Typography variant="h6" component="h3">Apple Calendar</Typography>
            <Typography variant="body1">
              On iOS, press the <strong>Calendars</strong> button at the bottom of the screen to go to the calendar list, and press <strong>Add Calendar</strong> and then <strong>Add Subscription Calendar</strong>. Paste in your calendar's address and press <strong>Subscribe</strong>.
            </Typography>
            <Typography variant="body1">
              On Mac, open the <strong>File</strong> menu and select <strong>New Calendar Subscription</strong>. Paste in your calendar's address and press <strong>Subscribe</strong>
            </Typography>
            <Typography variant="h6" component="h3">Outlook Calendar</Typography>
            <Typography variant="body1">
              Press <strong>Add calendar</strong> at the top of the calendar list and select <strong>Subscribe from web</strong>. Paste in your calendar's address and press <strong>Import</strong>
            </Typography>
            <Typography variant="body1">
              Calendars cannot be added to Outlook Calendar on mobile at the time of writing.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography component="span">What is transparency in a digital calendar?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              Events in a digital calendar can be marked as transparent or opaque, which controls how scheduling concurrent events works. Opaque events, the default in most calendar software will prevent other events from being scheduled at the same time. Some calendar software will prevent this action entirely, while others will display a warning. Transparent events don't have this effect, allowing events to be scheduled on top of each other. This is useful for events that may have many subevents, such as conferences, as well as events where other work occurs, such as optional events or minor holidays.
            </Typography>
            <Typography variant="body1">
              If your calendar has events marked as transparent or opaque when you don't want them to be, {productName} can help. Simply select the <strong>Modify Event Transparency</strong> option and choose the desired transparency setting. Note that this only affects the transparency logic in your copy of the calendar, if your calendar is shared, others will be able to see events that you create but will not be affected by the change in transparency.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Container>
      <Container component="section" maxWidth="sm" sx={{padding: 5}}>
        <Typography variant="h4" component="h2" sx={{textAlign: "center", padding: 1}}>Ready to Try It?</Typography>
        <FetchCalendar setCalendar={setCalendar} showTos={() => setShowTos(true)} showPrivacy={() => setShowPrivacy(true)} />
      </Container>
      <Container component="footer" maxWidth="lg">

      </Container>
      <CalendarOptions calendar={calendar} open={!!calendar} close={() => setCalendar(undefined)}></CalendarOptions>
      <Dialog open={showTos} onClose={() => setShowTos(false)}>
        <DialogTitle component="h2">Terms of Service</DialogTitle>
        <DialogContent>
          <TOS productName={productName} email={contactEmail} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowTos(false)}>
            Got It
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={showPrivacy} onClose={() => setShowPrivacy(false)}>
        <DialogTitle component="h2">Privacy Policy</DialogTitle>
        <DialogContent>
          <PrivacyPolicy productName={productName} email={contactEmail} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPrivacy(false)}>
            Got It
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  )
}

export default App;
