export type userInfo = {
    user_id: number,
    intra_id: string,
    auth?: boolean,
    email: string,
    phone?: string,
    access: string,
    refresh: string
}

export type lentInfo = {
    lent_id: number,
    lent_cabinet_id: number,
    lent_user_id: number,
    lent_time?: string,
    expire_time?: string,
    extension: boolean,
    intra_id?: string
}

//lent 된 Cabinet 하나의 Info
export type lentCabinetInfo = {
    lent_id: number,
    lent_cabinet_id: number,
    lent_user_id: number,
    lent_time: string,
    expire_time: string,
    extension: boolean,
    cabinet_num: number,
    location: string,
    floor: number,
    section: string,
    activation: boolean
}

//cabinet & lent table
export type cabinetInfo = {
    cabinet_id: number,
    cabinet_num: number,
    location: string,
    floor: number,
    section: string,
    activation: boolean,
}

//one location - ex) 새롬
export type cabinetListInfo = {
    location?: Array<string>,
    floor?: Array<Array<number>>,
    section?: Array<Array<Array<string>>>,
    cabinet?: Array<Array<Array<Array<cabinetInfo>>>>
}

//variables
export let userList:Array<userInfo> = [];

export let cabinetList:cabinetListInfo = {
    location: [],
    floor: [],
    section: [],
    cabinet: []
};
