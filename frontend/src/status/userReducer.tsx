import { userInfo } from "../types/userTypes";

const USER_ALL = "user/all";
const INITIALIZE = "user/initialize";

export const userAll = (data: userInfo) => ({
    type: USER_ALL,
    payload: data,
});

export const userInfoInitialize = () => ({
    type: INITIALIZE,
    payload: {}
});

const initialState: userInfo = {
    user_id: 0,
    intra_id: "default",
    email: "default",
    access: "default",
    refresh: "default",
};

type actionType = {
    type: string;
    payload: userInfo;
};

const userReducer = ( state = initialState, action: actionType ) => {
    switch (action.type) {
        case USER_ALL:
            return action.payload;
        case INITIALIZE:
            return initialState;
        default:
            return state;
    }
};

export default userReducer;