import { combineReducers } from "redux";
import cabinet from "./cabinet";
import lent from "./lent";

const rootReducer = combineReducers({
  cabinet,
  lent,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
