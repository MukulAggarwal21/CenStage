import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent, updateEvent } from '../redux/actions';
import '../styles/EventModal.css';

const CATEGORIES = ['exercise', 'eating', 'work', 'relax', 'family', 'social'];

const EventModal = ({ show, onClose, event, initialTime, taskData }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: '',
    category: 'work',
    startDate: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endDate: new Date().toISOString().split('T')[0],
    endTime: '10:00',
  });

  useEffect(() => {
    if (event) {
      // Edit existing event
      const startDate = new Date(event.startTime);
      const endDate = new Date(event.endTime);
      
      setFormData({
        title: event.title,
        category: event.category,
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
      });
    } else if (initialTime) {
      // Create new event with pre-selected time
      const startDate = new Date(initialTime);
      const endDate = new Date(initialTime);
      endDate.setHours(endDate.getHours() + 1);
      
      setFormData({
        title: taskData?.title || '',
        category: taskData?.category || 'work',
        startDate: startDate.toISOString().split('T')[0],
        startTime: startDate.toTimeString().slice(0, 5),
        endDate: endDate.toISOString().split('T')[0],
        endTime: endDate.toTimeString().slice(0, 5),
      });
    }
  }, [event, initialTime, taskData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    
    const eventData = {
      title: formData.title,
      category: formData.category,
      startTime: startDateTime,
      endTime: endDateTime,
      color: taskData?.color,
      goalId: taskData?.goalId,
    };
    
    if (event) {
      // Update existing event
      dispatch(updateEvent({ 
        ...eventData, 
        id: event.id 
      }));
    } else {
      // Create new event
      dispatch(createEvent(eventData));
    }
    
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className="event-modal">
        <div className="modal-header">
          <h2>{event ? 'Edit Event' : 'Create New Event'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="Event title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                id="startTime"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-button">
              {event ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;