type userInfo = {
    user_id: number,
    intra_id: string,
    auth: number,
    email: string,
    phone: string
}
type cabinetInfo = {
    cabinet_id: number,
    cabinet_num: number,
    location: string,
    floor: number,
    section: string,
    activation: boolean,
    lent_id: number,
    user_id: number,
    lent_time: Date,
    expire_time: Date,
    extension: boolean
}
type lentInfo = {
    lent_id: number,
    lent_cabinet_id: number,
    lent_user_id: number,
    lent_time?: string,
    expire_time?: string,
    extension: boolean
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
