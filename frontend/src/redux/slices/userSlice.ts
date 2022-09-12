import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Define a type for the slice state
export interface userInfo {
  user_id: number;
  intra_id: string;
  auth?: boolean;
  email: string;
  phone?: string;
  access?: string;
  refresh?: string;
};

// Define the initial state using that type
const initialState = {
  user_id: 0,
  intra_id: "default",
  email: "default",
  access: "default",
  refresh: "default",
} as userInfo;

export const userSlice = createSlice({
  name: 'user',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    userAll: (state, action: PayloadAction<userInfo>) => {
      return action.payload;
    },
    userInfoInitialize: (state) => {
      return initialState;
    },
  }
})

export const { userAll, userInfoInitialize } = userSlice.actions;

export default userSlice.reducer;