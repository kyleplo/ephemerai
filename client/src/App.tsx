import { PropsWithChildren, useState } from 'react';
import CalendarOptions from './CalendarOptions';
import { CalendarInfo } from '../../src/parseCalendar';
import { FetchCalendar } from './FetchCalendar';
import { Accordion, AccordionDetails, AccordionSummary, AppBar, Container, Toolbar, Typography, Grid2 as Grid, Paper, Stack } from '@mui/material';
import { InfoOutlined as InfoIcon, MoreVert as MoreVertIcon, ExpandMore as ExpandMoreIcon, Place as PlaceIcon, AutoAwesome as AIIcon, Person as PersonIcon, LowPriority as PriorityIcon, Opacity as OpacityIcon, NotificationsOff as NotificationsOffIcon } from '@mui/icons-material';

const productName = "Secretary";

function FeaturePaper (props: PropsWithChildren) {
  return <Grid size={1} sx={{display: "flex"}}>
    <Paper>
      <Stack sx={{alignItems: "center", textAlign: "center", padding: 3}}>
        {props.children}
      </Stack>
    </Paper>
  </Grid>
}

function App() {
  const [calendar, setCalendar] = useState<CalendarInfo | undefined>(undefined);

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {productName}
          </Typography>
        </Toolbar>
      </AppBar>
      <FetchCalendar setCalendar={setCalendar}></FetchCalendar>
      {/* header with image and input */}
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
      </Container>
      <Container component="section" maxWidth="sm" sx={{paddingBlock: 3}}>
        <Typography variant="h4" component="h2" sx={{textAlign: "center", padding: 1}}>Ready to Try It?</Typography>
        <FetchCalendar setCalendar={setCalendar} fullWidth></FetchCalendar>
      </Container>
      {/* "ready to try it" with another input */}
      {/* footer */}
      <CalendarOptions calendar={calendar} open={!!calendar} close={() => setCalendar(undefined)}></CalendarOptions>
    </>
  )
}

export default App;
