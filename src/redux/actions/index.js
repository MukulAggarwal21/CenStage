import api from '../../services/api';

export const fetchGoals = () => async (dispatch) => {
  dispatch({ type: 'FETCH_GOALS_REQUEST' });
  
  try {
    const response = await api.getGoals();
    dispatch({
      type: 'FETCH_GOALS_SUCCESS',
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_GOALS_FAILURE',
      payload: error.message
    });
  }
};

// Task actions
export const fetchTasks = (goalId) => async (dispatch) => {
  dispatch({ type: 'FETCH_TASKS_REQUEST' });
  
  try {
    const response = await api.getTasks(goalId);
    dispatch({
      type: 'FETCH_TASKS_SUCCESS',
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_TASKS_FAILURE',
      payload: error.message
    });
  }
};

// Event actions
export const fetchEvents = (dateRange) => async (dispatch) => {
  dispatch({ type: 'FETCH_EVENTS_REQUEST' });
  
  try {
    const response = await api.getEvents(dateRange);
    dispatch({
      type: 'FETCH_EVENTS_SUCCESS',
      payload: response.data
    });
  } catch (error) {
    dispatch({
      type: 'FETCH_EVENTS_FAILURE',
      payload: error.message
    });
  }
};

export const createEvent = (eventData) => async (dispatch) => {
  try {
    const response = await api.createEvent(eventData);
    dispatch({
      type: 'CREATE_EVENT_SUCCESS',
      payload: response.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'CREATE_EVENT_FAILURE',
      payload: error.message
    });
    throw error;
  }
};

export const updateEvent = (eventData) => async (dispatch) => {
  try {
    const response = await api.updateEvent(eventData.id, eventData);
    dispatch({
      type: 'UPDATE_EVENT_SUCCESS',
      payload: response.data
    });
    return response.data;
  } catch (error) {
    dispatch({
      type: 'UPDATE_EVENT_FAILURE',
      payload: error.message
    });
    throw error;
  }
};

export const deleteEvent = (eventId) => async (dispatch) => {
  try {
    await api.deleteEvent(eventId);
    dispatch({
      type: 'DELETE_EVENT_SUCCESS',
      payload: eventId
    });
  } catch (error) {
    dispatch({
      type: 'DELETE_EVENT_FAILURE',
      payload: error.message
    });
    throw error;
  }
};
