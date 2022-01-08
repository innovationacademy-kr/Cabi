export type userInfo = {
    user_id: number,
    intra_id: string,
    auth: number,
    email: string,
    phone: string
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
export let user:userInfo = {
    user_id: 39393,
    intra_id: "spark",
    auth: 1,
    email: "spark@student.42seoul.kr",
    phone: "01012344567"
}

export let lent:lentInfo = {
    lent_id: 1,
    lent_cabinet_id: 2,
    lent_user_id: 2,
    extension: true
}

export let cabinetLent:Array<lentInfo> = [];

export let cabinetList:cabinetListInfo = {
    location: [],
    floor: [],
    section: [],
    cabinet: []
};