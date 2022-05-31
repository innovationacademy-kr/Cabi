import { lentInfo } from "../pages/Lent";

const LENTSTORE_ALL = "lentStore/all";
const INITIALIZE = "lentStore/initialize";

export const lentStoreAll = (data: lentInfo) => ({
  type: LENTSTORE_ALL,
  payload: data,
});
export const lentInfoInitialize = () => ({
  type: INITIALIZE,
  payload: {},
});

const initialState = {};

type actionType = {
  type: string;
  payload: lentInfo;
};

const lentStore = (state = initialState, action: actionType) => {
  switch (action.type) {
    case LENTSTORE_ALL:
      return action.payload;
    case INITIALIZE:
      return initialState;
    default:
      return state;
  }
};

export default lentStore;
