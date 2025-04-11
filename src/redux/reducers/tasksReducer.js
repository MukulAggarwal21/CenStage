const initialState = {
  items: [],
  loading: false,
  error: null
};

const tasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_TASKS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_TASKS_SUCCESS':
      return {
        ...state,
        loading: false,
        items: action.payload
      };
    case 'FETCH_TASKS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

export default tasksReducer;
