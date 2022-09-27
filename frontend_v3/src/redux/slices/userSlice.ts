import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDto } from "../../types/dto/user.dto";

// Define the initial state using that type
const initialState = {
  user_id: 0,
  intra_id: "default",
  cabinet_id: -1,
} as UserDto;

export const userSlice = createSlice({
  name: "user",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    userAll: (state, action: PayloadAction<UserDto>) => {
      return action.payload;
    },
    userInfoInitialize: (state) => {
      return initialState;
    },
    setUserCabinet: (state, action: PayloadAction<number>) => {
      state.cabinet_id = action.payload;
    },
  },
});

export const { userAll, userInfoInitialize, setUserCabinet } =
  userSlice.actions;

export default userSlice.reducer;
