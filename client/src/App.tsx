import { useState } from 'react';
import CalendarOptions from './CalendarOptions';
import { CalendarInfo } from '../../src/parseCalendar';
import { FetchCalendar } from './FetchCalendar';

function App() {
  const [calendar, setCalendar] = useState<CalendarInfo | undefined>(undefined);

  return (
    <>
      <FetchCalendar setCalendar={setCalendar}></FetchCalendar>
      <CalendarOptions calendar={calendar} open={!!calendar} close={() => setCalendar(undefined)}></CalendarOptions>
    </>
  )
}

export default App;
