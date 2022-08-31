import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector  } from 'react-redux';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { Navbar } from '../ui/Navbar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { uiOpenModal } from './../../actions/ui';
import { eventSetActive, eventClearActiveEvent, eventStartLoading } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFAB';
import { DeleteFab } from '../ui/DeleteFAB';


const localizer = momentLocalizer(moment);

export const CalendarScreen = () => {

  const dispatch = useDispatch();
  const { events, activeEvent } = useSelector( state => state.calendar );
  const [lastView, setLastView] = useState( localStorage.getItem('lastView') || 'month' );
  const { uid } = useSelector( state => state.auth );

  useEffect(() => {
    dispatch( eventStartLoading() );
  }, [ dispatch ])

  const onDoubleClick = (e) => {
    dispatch(uiOpenModal());
  }

  const onSelectSlot = (e) => {
    dispatch( eventClearActiveEvent() );
  }

  const onViewChange = (e) => {
    setLastView(e);
    localStorage.setItem('lastView', e);
  }

  const onSelectEvent = (e) => {
    dispatch(eventSetActive(e));
  }

  const eventStyleGetter = ( event, start, end, isSelected ) => {
    const style = {
      backgroundColor: ( uid === event.user._id ) ? '#367CF7' : '#465660',
      borderRadius: '0px',
      opacity: 0.8,
      display: 'block',
      color: 'white'
    }
    return { style }
  };

  return (
    <div className="calendar-screen">
      <Navbar />
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={ eventStyleGetter }
        onDoubleClickEvent={ onDoubleClick }
        onSelectEvent={ onSelectEvent }
        onSelectSlot={ onSelectSlot }
        selectable={true}
        onView={onViewChange}
        view={lastView}
        components={{
          event:CalendarEvent
        }}
      />
      <AddNewFab />
      {
        (activeEvent) && <DeleteFab />
      }

      <CalendarModal />
    </div>
  )
}
