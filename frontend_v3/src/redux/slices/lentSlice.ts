import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface lentInfo {
  lent_id: number;
  lent_cabinet_id: number;
  lent_user_id: number;
  lent_time?: string;
  expire_time?: string;
  extension: number;
  intra_id?: string;
}

export interface lentCabinetInfo extends lentInfo {
  cabinet_num: number;
  location: string;
  floor: number;
  section: string;
  activation: boolean;
}

// Define the initial state using that type
const initialState = [] as lentInfo[];

export const lentSlice = createSlice({
  name: "lent",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    lentAll: (state, action: PayloadAction<lentInfo[]>) => {
      return action.payload;
    },
    lentInfoInitialize: (state) => {
      return initialState;
    },
  },
});

export const { lentAll, lentInfoInitialize } = lentSlice.actions;

export default lentSlice.reducer;
