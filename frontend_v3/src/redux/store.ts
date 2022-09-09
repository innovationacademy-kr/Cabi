import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import lentSlice from "./slices/lentSlice";
import cabinetSlice from "./slices/cabinetSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    lent: lentSlice,
    cabinet: cabinetSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
