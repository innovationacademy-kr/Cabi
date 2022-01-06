type userInfo = {
    user_id: number,
    intra_id: string,
    auth: number,
    email: string,
    phone: string
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

type lentInfo = {
    lent_id: number,
    lent_cabinet_id: number,
    lent_user_id: number,
    lent_time?: string,
    expire_time?: string,
    extension: boolean,
    intra_id?: string
}

//one location - ex) 새롬
export type locationInfo = {
    location: Array<string>,
    floor: Array<Array<number>>,
    section?: Array<Array<Array<string>>>,
    cabinet?: Array<cabinetInfo>
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
export let lentForPost:lentInfo = {
  lent_id: 2,
  lent_cabinet_id: 42,
  lent_user_id: 1, 
  lent_time: "date",
  expire_time: "date", 
  extension: true
}
export let cabinet:Array<cabinetInfo> = [];