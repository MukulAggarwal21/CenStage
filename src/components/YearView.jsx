import React from 'react';
import MonthView from './MonthView';
import '../styles/YearView.css';

const YearView = ({ currentDate, onTimeSlotClick, onEventClick }) => {
  // Generate all months for the current year
  const getMonthsInYear = (date) => {
    const months = [];
    const year = date.getFullYear();
    for (let month = 0; month < 12; month++) {
      months.push(new Date(year, month, 1));
    }
    return months;
  };

  const months = getMonthsInYear(currentDate);

  // Scroll to the selected month when a month button is clicked
  const handleMonthClick = (month) => {
    const element = document.getElementById(`month-${month.getMonth()}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Scroll to the current month when the "Today" button is clicked
  const handleTodayClick = () => {
    const today = new Date();
    const currentMonthElement = document.getElementById(`month-${today.getMonth()}`);
    if (currentMonthElement) {
      currentMonthElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="year-view">
      {/* Navigation bar with "Today" button and month buttons */}
      <div className="year-navigation">
        <button onClick={handleTodayClick} className="today-button">
          Today
        </button>
        {months.map((month, index) => (
          <button
            key={index}
            onClick={() => handleMonthClick(month)}
            className="month-nav-button"
          >
            {month.toLocaleString('default', { month: 'short' })}
          </button>
        ))}
      </div>

      {/* Grid displaying all months */}
      <div className="year-grid">
        {months.map((month, index) => (
          <div key={index} id={`month-${month.getMonth()}`} className="month-container">
            <h3>{month.toLocaleString('default', { month: 'long' })}</h3>
            <MonthView
              currentDate={month}
              onTimeSlotClick={onTimeSlotClick}
              onEventClick={onEventClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default YearView;