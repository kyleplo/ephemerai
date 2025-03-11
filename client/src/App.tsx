import { useState } from 'react';
import './App.css'
import CalendarOptions from './CalendarOptions';
import { CalendarInfo } from '../../src/parseCalendar';
import { FetchCalendar } from './FetchCalendar';

function App() {
  const [calendar, setCalendar] = useState<CalendarInfo | null>(null);

  return (
    <>
      {calendar ?
        <CalendarOptions calendar={calendar}></CalendarOptions> :
        <FetchCalendar setCalendar={setCalendar}></FetchCalendar>}
    </>
  )
}

export default App;
