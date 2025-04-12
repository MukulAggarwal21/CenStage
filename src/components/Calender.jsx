

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchGoals, fetchTasks, fetchEvents } from '../redux/actions';
import Sidebar from './Sidebar';
import WeekView from './WeekView';
import MonthView from './MonthView';
import YearView from './YearView';
import EventModal from './EventModal';
import '../styles/Calendar.css';

const Calendar = () => {
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [view, setView] = useState('week'); // Default to week view

  useEffect(() => {
    dispatch(fetchGoals());
    dispatch(fetchEvents(getWeekBounds(currentDate)));
  }, [dispatch]);

  const getWeekBounds = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return { start: startOfWeek, end: endOfWeek };
  };

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else if (view === 'year') {
      newDate.setFullYear(currentDate.getFullYear() - 1);
    }
    setCurrentDate(newDate);
    dispatch(fetchEvents(getWeekBounds(newDate)));
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else if (view === 'month') {
      newDate.setMonth(currentDate.getMonth() + 1);
    } else if (view === 'year') {
      newDate.setFullYear(currentDate.getFullYear() + 1);
    }
    setCurrentDate(newDate);
    dispatch(fetchEvents(getWeekBounds(newDate)));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    dispatch(fetchEvents(getWeekBounds(today)));
  };

  const handleTimeSlotClick = (time, preFilledEvent = null) => {
    setSelectedEvent(preFilledEvent);
    setSelectedTime(time);
    setShowModal(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setSelectedTime(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
    setSelectedTime(null);
  };

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
  };

  return (
    <div className="calendar-container">
      <Sidebar
        onGoalSelect={handleGoalSelect}
        selectedGoal={selectedGoal}
      />
      <div className="calendar-main">
        <div className="calendar-header">
          <div className="calendar-title">
            <h1>Calendar</h1>
          </div>
          <div className="calendar-controls">
            <button onClick={handleToday}>Today</button>
            <button onClick={handlePrev}>&lt;</button>
            <button onClick={handleNext}>&gt;</button>
            <div className="view-controls">
              <button onClick={() => setView('week')} className={view === 'week' ? 'active' : ''}>Week</button>
              <button onClick={() => setView('month')} className={view === 'month' ? 'active' : ''}>Month</button>
              <button onClick={() => setView('year')} className={view === 'year' ? 'active' : ''}>Year</button>
            </div>
          </div>
        </div>
        {view === 'week' && (
          <WeekView
            currentDate={currentDate}
            onTimeSlotClick={handleTimeSlotClick}
            onEventClick={handleEventClick}
          />
        )}
        {view === 'month' && (
          <MonthView
            currentDate={currentDate}
            onTimeSlotClick={handleTimeSlotClick}
            onEventClick={handleEventClick}
          />
        )}
        {view === 'year' && (
          <YearView
            currentDate={currentDate}
            onTimeSlotClick={handleTimeSlotClick}
            onEventClick={handleEventClick}
          />
        )}
      </div>
      {showModal && (
        <EventModal
          show={showModal}
          onClose={handleCloseModal}
          event={selectedEvent}
          initialTime={selectedTime}
        />
      )}
    </div>
  );
};

export default Calendar;