


import React from 'react';
import { useSelector } from 'react-redux';
import CalendarEvent from './CalendarEvent';
import '../styles/MonthView.css'; // Create a new CSS file for MonthView-specific styles

const MonthView = ({ currentDate, onTimeSlotClick, onEventClick }) => {
    const events = useSelector(state => state.events.items);

    const getDaysInMonthMatrix = (date) => {
        const daysMatrix = [];
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Get the day of the week for the first day of the month
        const startDayOfWeek = firstDay.getDay();

        // Fill the first row with empty slots until the first day
        let week = Array(startDayOfWeek).fill(null);

        for (let day = firstDay; day <= lastDay; day.setDate(day.getDate() + 1)) {
            week.push(new Date(day));
            if (week.length === 7) {
                daysMatrix.push(week);
                week = [];
            }
        }

        // Fill the last row with empty slots if needed
        if (week.length > 0) {
            while (week.length < 7) {
                week.push(null);
            }
            daysMatrix.push(week);
        }

        return daysMatrix;
    };

    const daysMatrix = getDaysInMonthMatrix(currentDate);

    const isToday = (date) => {
        const today = new Date();
        return date?.getDate() === today.getDate() &&
            date?.getMonth() === today.getMonth() &&
            date?.getFullYear() === today.getFullYear();
    };

    const getEventsForDay = (day) => {
        return events.filter(event => {
            const eventDate = new Date(event.startTime);
            return eventDate.getDate() === day.getDate() &&
                eventDate.getMonth() === day.getMonth() &&
                eventDate.getFullYear() === day.getFullYear();
        });
    };

    //   const handleDayClick = (day) => {
    // //     if (day) {
    // //     // Ensure the time is set to midnight to avoid timezone issues
    // //     const normalizedDay = new Date(day);
    // //     normalizedDay.setHours(0, 0, 0, 0);
    // //     onTimeSlotClick(normalizedDay);
    // //   }
    //   if (day) {
    //     // Normalize the date to midnight in the local timezone
    //     const normalizedDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    //     onTimeSlotClick(normalizedDay);
    //   }
    //   };


    const handleDayClick = (day) => {
        if (day) {
            // Normalize the date to midnight in the local timezone and add one day
            const normalizedDay = new Date(day.getFullYear(), day.getMonth(), day.getDate());
            normalizedDay.setDate(normalizedDay.getDate() + 1); // Add one day
            onTimeSlotClick(normalizedDay);
        }
    };

    return (
        <div className="month-view">
            <div className="month-header">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div key={index} className="day-header">
                        {day}
                    </div>
                ))}
            </div>
            <div className="month-grid">
                {daysMatrix.map((week, weekIndex) => (
                    <div key={weekIndex} className="week-row">
                        {week.map((day, dayIndex) => (
                            <div
                                key={dayIndex}
                                className={`day-cell ${isToday(day) ? 'today' : ''} ${day ? '' : 'empty'}`}
                                onClick={() => handleDayClick(day)}
                            >
                                {day && <div className="day-number">{day.getDate()}</div>}
                                {day && getEventsForDay(day).map(event => (
                                    <CalendarEvent
                                        key={event.id}
                                        event={event}
                                        onClick={() => onEventClick(event)}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MonthView;