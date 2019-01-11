import isEmpty from "../validation/is-empty";

import { GET_CURRENT_USER } from "../actions/types";
import { SET_NEW_PW } from "../actions/types";
import { SEND_FP_EMAIL } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case SEND_FP_EMAIL:
      return {
        ...state,
        PWEmailSent: action.payload
      };
    case SET_NEW_PW:
      return {
        ...state,
        PWSaved: action.payload
      };
    default:
      return state;
  }
}
