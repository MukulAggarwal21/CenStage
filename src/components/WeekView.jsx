

import React from 'react';
import { useSelector } from 'react-redux';
import CalendarEvent from './CalendarEvent';
import '../styles/WeekView.css';

const WeekView = ({ currentDate, onTimeSlotClick, onEventClick }) => {
  const events = useSelector(state => state.events.items);

  // Get days of the week based on current date
  const getDaysOfWeek = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    // Set to Monday of current week
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + (currentDate.getDay() === 0 ? -6 : 1));

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const days = getDaysOfWeek();

  // Create time slots for the full day (24 hours)
  const timeSlots = [];
  for (let hour = 0; hour < 24; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  const formatDate = (date) => {
    return date.getDate();
  };

  const formatDay = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const getEventsForDayAndTime = (day, timeSlot) => {
    const [hour] = timeSlot.split(':').map(Number);

    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear() &&
        eventDate.getHours() === hour;
    });
  };

  // const handleTimeSlotClick = (day, timeSlot) => {
  //   const [hour] = timeSlot.split(':').map(Number);
  //   const selectedTime = new Date(day);
  //   selectedTime.setHours(hour, 0, 0, 0);
  //   onTimeSlotClick(selectedTime);
  // };

  const handleTimeSlotClick = (day, timeSlot) => {
    const [hour] = timeSlot.split(':').map(Number);
    const selectedTime = new Date(day);
    selectedTime.setHours(hour, 0, 0, 0);

    // Add one day to the selected date
    selectedTime.setDate(selectedTime.getDate() + 1);

    onTimeSlotClick(selectedTime);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, day, timeSlot) => {
    e.preventDefault();
    const taskData = e.dataTransfer.getData('task');
    if (taskData) {
      const task = JSON.parse(taskData);
      const [hour] = timeSlot.split(':').map(Number);
      const dropTime = new Date(day);
      dropTime.setHours(hour, 0, 0, 0);

      // Create pre-populated event from task
      const eventData = {
        title: task.name,
        category: task.category || 'work',
        startTime: dropTime,
        endTime: new Date(dropTime.getTime() + 60 * 60 * 1000), // 1 hour duration
        color: task.color,
        goalId: task.goalId,
      };

      onTimeSlotClick(dropTime, eventData); // Open modal with pre-filled data
    }
  };

  return (
    <div className="week-view">
      <div className="time-header">
        <div className="time-gutter"></div>
        {days.map((day, index) => (
          <div
            key={index}
            className={`day-header ${isToday(day) ? 'today' : ''}`}
          >
            <div className="day-name">{formatDay(day)}</div>
            <div className="day-date">{formatDate(day)}</div>
          </div>
        ))}
      </div>

      <div className="time-grid">
        {timeSlots.map((timeSlot, timeIndex) => (
          <div key={timeIndex} className="time-row">
            <div className="time-gutter">
              <span>{timeSlot}</span>
            </div>

            {days.map((day, dayIndex) => {
              const cellEvents = getEventsForDayAndTime(day, timeSlot);

              return (
                <div
                  key={dayIndex}
                  className={`time-cell ${isToday(day) ? 'today' : ''}`}
                  onClick={() => handleTimeSlotClick(day, timeSlot)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, day, timeSlot)}
                >
                  {cellEvents.map(event => (
                    <CalendarEvent
                      key={event.id}
                      event={event}
                      onClick={() => onEventClick(event)}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeekView;