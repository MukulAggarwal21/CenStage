import axios from 'axios';

// const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const baseURL =  'http://localhost:5000/api';


const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  // Goals
  getGoals: () => api.get('/goals'),
  
  // Tasks
  getTasks: (goalId) => api.get(`/goals/${goalId}/tasks`),
  
  // Events
  getEvents: (dateRange) => {
    const params = {};
    if (dateRange) {
      params.startDate = dateRange.start.toISOString();
      params.endDate = dateRange.end.toISOString();
    }
    return api.get('/events', { params });
  },
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`)
};