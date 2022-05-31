import { combineReducers } from "redux";
import cabinet from "./cabinetReducer";
import lent from "./lentReducer";

const rootReducer = combineReducers({
  cabinet,
  lent,
});
export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
