const initialState = {
  items: [],
  loading: false,
  error: null
};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_EVENTS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_EVENTS_SUCCESS':
      return {
        ...state,
        loading: false,
        items: action.payload
      };
    case 'FETCH_EVENTS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'CREATE_EVENT_SUCCESS':
      return {
        ...state,
        items: [...state.items, action.payload]
      };
    case 'UPDATE_EVENT_SUCCESS':
      return {
        ...state,
        items: state.items.map(event => 
          event.id === action.payload.id ? action.payload : event
        )
      };
    case 'DELETE_EVENT_SUCCESS':
      return {
        ...state,
        items: state.items.filter(event => event.id !== action.payload)
      };
    default:
      return state;
  }
};

export default eventsReducer;