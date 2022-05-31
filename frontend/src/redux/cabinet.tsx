import { locationInfo } from "../pages/Lent";

const CABINET_ALL = "cabinet/all";
const INITIALIZE = "cabinet/initialize";

export const cabinetAll = (data: locationInfo) => ({
  type: CABINET_ALL,
  payload: data,
});
export const cabinetInitialize = () => ({ type: INITIALIZE, payload: {} });

const initialState: locationInfo = {};

type actionType = {
  type: string;
  payload: locationInfo;
};

const cabinet = (state = initialState, action: actionType) => {
  switch (action.type) {
    case CABINET_ALL:
      return action.payload;
    case INITIALIZE:
      return initialState;
    default:
      return state;
  }
};

export default cabinet;
