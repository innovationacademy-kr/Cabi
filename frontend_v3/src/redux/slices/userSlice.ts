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
  },
});

export const { userAll, userInfoInitialize } = userSlice.actions;

export default userSlice.reducer;
