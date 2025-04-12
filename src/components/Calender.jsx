import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoals, fetchTasks, fetchEvents } from '../redux/actions';
import Sidebar from './Sidebar';
import WeekView from './WeekView';
import EventModal from './EventModal';
// import '../styles/Calendar.css';
import '../styles/Calendar.css';

const Calendar = () => {
  const dispatch = useDispatch();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  
  useEffect(() => {
    // Fetch initial data from API
    dispatch(fetchGoals());
    dispatch(fetchEvents(getWeekBounds(currentDate)));
  }, [dispatch]);

  // When a goal is selected, fetch its related tasks
  useEffect(() => {
    if (selectedGoal) {
      dispatch(fetchTasks(selectedGoal.id));
    }
  }, [selectedGoal, dispatch]);

  const getWeekBounds = (date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1));
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return { start: startOfWeek, end: endOfWeek };
  };

  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
    dispatch(fetchEvents(getWeekBounds(newDate)));
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
    dispatch(fetchEvents(getWeekBounds(newDate)));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    dispatch(fetchEvents(getWeekBounds(today)));
  };

  const handleTimeSlotClick = (time) => {
    setSelectedEvent(null);
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

  const handleTaskDragStart = (task) => {
    // Implement drag functionality
  };

  return (
    <div className="calendar-container">
      <Sidebar 
        onGoalSelect={handleGoalSelect} 
        selectedGoal={selectedGoal}
        onTaskDragStart={handleTaskDragStart}
      />
      <div className="calendar-main">
        <div className="calendar-header">
          <div className="calendar-title">
            <h1>Calendar</h1>
          </div>
          <div className="calendar-controls">
            <button onClick={handleToday}>Today</button>
            <button onClick={handlePrevWeek}>&lt;</button>
            <button onClick={handleNextWeek}>&gt;</button>
            <div className="view-controls">
              <button className="active">Week</button>
              <button>Month</button>
              <button>Year</button>
            </div>
          </div>
        </div>
        <WeekView 
          currentDate={currentDate}
          onTimeSlotClick={handleTimeSlotClick}
          onEventClick={handleEventClick}
        />
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