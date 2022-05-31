import { combineReducers } from "redux";
import cabinetReducer from "./cabinetReducer";
import lentReducer from "./lentReducer";
import userReducer from "./userReducer";

const rootReducer = combineReducers({
  cabinetReducer,
  lentReducer,
  userReducer
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
