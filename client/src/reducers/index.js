import { combineReducers } from "redux";
import authReducer from "./authReducer";
import forgotEmailReducer from "./forgotEmailReducer";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";
import postReducer from "./postReducer";

export default combineReducers({
  auth: authReducer,
  forgotEmail: forgotEmailReducer,
  errors: errorReducer,
  profile: profileReducer,
  post: postReducer
});
