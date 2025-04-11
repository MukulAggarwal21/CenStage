import React, { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { updateEvent, deleteEvent } from '../redux/actions';
import '../styles/CalendarEvent.css';

const CalendarEvent = ({ event, onClick }) => {
  const dispatch = useDispatch();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const dragRef = useRef(null);
  const startPos = useRef(null);
  const originalEvent = useRef(null);

  const calculateEventHeight = () => {
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);
    const durationMinutes = (endTime - startTime) / (1000 * 60);
    
    // Base height calculation: 1 minute = 1px (or any other scale)
    return `${durationMinutes}px`;
  };

  const getCategoryColor = () => {
    const colors = {
      exercise: '#ff9a9e',
      eating: '#a1c4fd',
      work: '#84fab0',
      relax: '#ffecd2',
      family: '#d4fc79',
      social: '#e2b0ff'
    };
    
    return event.color || colors[event.category] || '#cfd9df';
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    originalEvent.current = { ...event };
    
    // Create a transparent drag image
    const dragImg = document.createElement('div');
    dragImg.style.opacity = '0';
    document.body.appendChild(dragImg);
    e.dataTransfer.setDragImage(dragImg, 0, 0);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = (e) => {
    e.stopPropagation();
    setIsDragging(false);
    
    // If the event was actually moved, update it
    if (startPos.current && 
        (Math.abs(e.clientX - startPos.current.x) > 5 || 
         Math.abs(e.clientY - startPos.current.y) > 5)) {
      // Calculate new times based on drag distance
      // This is a simplified version; you'd need to map screen coordinates to time
      const hourDiff = Math.round((e.clientY - startPos.current.y) / 60); // 60px per hour
      const dayDiff = Math.round((e.clientX - startPos.current.x) / 150); // 150px per day
      
      const newStartTime = new Date(originalEvent.current.startTime);
      newStartTime.setHours(newStartTime.getHours() + hourDiff);
      newStartTime.setDate(newStartTime.getDate() + dayDiff);
      
      const newEndTime = new Date(originalEvent.current.endTime);
      newEndTime.setHours(newEndTime.getHours() + hourDiff);
      newEndTime.setDate(newEndTime.getDate() + dayDiff);
      
      dispatch(updateEvent({
        ...event,
        startTime: newStartTime,
        endTime: newEndTime
      }));
    }
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsResizing(true);
    startPos.current = { y: e.clientY };
    originalEvent.current = { ...event };
    
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', handleResizeEnd);
  };

  const handleResize = (e) => {
    if (!isResizing) return;
    
    const diff = e.clientY - startPos.current.y;
    const minutesDiff = Math.round(diff / 1); // 1px per minute
    
    const newEndTime = new Date(originalEvent.current.endTime);
    newEndTime.setMinutes(newEndTime.getMinutes() + minutesDiff);
    
    // Prevent endTime from being before startTime
    if (newEndTime > new Date(originalEvent.current.startTime)) {
      dragRef.current.style.height = `${(newEndTime - new Date(originalEvent.current.startTime)) / (1000 * 60)}px`;
    }
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', handleResizeEnd);
    
    const height = dragRef.current.style.height;
    const durationMinutes = parseInt(height, 10);
    
    const newEndTime = new Date(event.startTime);
    newEndTime.setMinutes(newEndTime.getMinutes() + durationMinutes);
    
    dispatch(updateEvent({
      ...event,
      endTime: newEndTime
    }));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this event?')) {
      dispatch(deleteEvent(event.id));
    }
  };

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      ref={dragRef}
      className={`calendar-event ${isExpanded ? 'expanded' : ''}`}
      style={{
        backgroundColor: getCategoryColor(),
        height: calculateEventHeight(),
      }}
      onClick={onClick}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="event-content">
        <div className="event-title">{event.title}</div>
        <div className="event-time">
          {formatTime(event.startTime)} - {formatTime(event.endTime)}
        </div>
        {isExpanded && (
          <div className="event-details">
            <div className="event-category">{event.category}</div>
          </div>
        )}
      </div>
      
      <div className="event-actions">
        <button className="event-action expand" onClick={handleToggleExpand}>
          {isExpanded ? '▲' : '▼'}
        </button>
        <button className="event-action delete" onClick={handleDelete}>×</button>
      </div>
      
      <div 
        className="resize-handle"
        onMouseDown={handleResizeStart}
      ></div>
    </div>
  );
};

export default CalendarEvent;