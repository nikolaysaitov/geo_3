import { createStore } from "redux";

const initialState = {
  userGroup: "",
  userName: "",
  userSurName: ""
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case "SET_USER_GROUP":
      return { ...state, userGroup: action.payload };
    case "SET_USER_NAME":
      return { ...state, userName: action.payload };
    case "SET_USER_SURNAME":
      return { ...state, userSurName: action.payload };
    default:
      return state;
  };
  
  
}

const store = createStore(reducer);

export default store;
