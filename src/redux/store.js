import { legacy_createStore as createStore} from 'redux'

const initialState = {
  userGroup: "",
  userName: "",
  userSurName: "",
  selectedRegion: null,
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER_GROUP":
      return { ...state, userGroup: action.payload };
    case "SET_USER_NAME":
      return { ...state, userName: action.payload };
    case "SET_USER_SURNAME":
      return { ...state, userSurName: action.payload };
    case "SET_SELECTED_REGION":
      return {
        ...state,
        selectedRegion: action.payload,
      };
    default:
      return state;
  }
}

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;
export const getSelectedRegion = (state) => state.selectedRegion;
