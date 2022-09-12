import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

export interface cabinetInfo {
	cabinet_id: number;
	cabinet_num: number;
	location: string;
	floor: number;
	section: string;
	activation: boolean;
};

// Define a type for the slice state
export interface locationInfo {
  location: Array<string>;
  floor: Array<Array<number>>;
  section: Array<Array<Array<string>>>;
  cabinet: Array<Array<Array<Array<cabinetInfo>>>>;
};

// Define the initial state using that type
const initialState = {} as locationInfo;

export const cabinetSlice = createSlice({
  name: 'cabinet',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    cabinetAll: (state, action: PayloadAction<locationInfo>) => {
      return action.payload;
    },
    cabinetInitialize: (state) => {
      return initialState;
    },
  }
})

export const { cabinetAll, cabinetInitialize } = cabinetSlice.actions;

export default cabinetSlice.reducer;