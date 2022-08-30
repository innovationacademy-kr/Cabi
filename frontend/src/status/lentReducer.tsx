import { lentInfo } from "../types/cabinetTypes";

const LENT_ALL = "lent/all";
const INITIALIZE = "lent/initialize";

export const lentAll = (data: lentInfo[] ) => ({
  type: LENT_ALL,
  payload: data,
});
export const lentInfoInitialize = () => ({
  type: INITIALIZE,
  payload: [],
});

const initialState: lentInfo[] = [];

type actionType = {
  type: string;
  payload: lentInfo[];
};

const lentStore = (state = initialState, action: actionType) => {
  switch (action.type) {
    case LENT_ALL:
      return action.payload;
    case INITIALIZE:
      return initialState;
    default:
      return state;
  }
};

export default lentStore;
