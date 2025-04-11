const initialState = {
  items: [],
  loading: false,
  error: null
};

const goalsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_GOALS_REQUEST':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'FETCH_GOALS_SUCCESS':
      return {
        ...state,
        loading: false,
        items: action.payload
      };
    case 'FETCH_GOALS_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};
export default goalsReducer;
