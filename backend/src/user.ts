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

type lentData = {
    cabinet_id: number
}

export let user:userInfo = {
    user_id: 1,
    intra_id: "spark",
    auth: 1,
    email: "spark@student.42seoul.kr",
    phone: "01012344567"
}