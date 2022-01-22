import axios from 'axios'
import {useState, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import { userInfo } from './Main'
import Menu from '../component/Menu'
import Carousel from '../component/Carousel'
import Location from '../component/Location'
import LentModal from '../modal/LentModal'
import ContentsModal from '../modal/ContentsModal';
import './lent.css'
import './main.css'

export type cabinetInfo = {
  cabinet_id: number,
  cabinet_num: number,
  location: string,
  floor: number,
  section: string,
  activation: boolean,
}
export type locationInfo = {
  location?: Array<string>,
  floor?: Array<Array<number>>,
  section?: Array<Array<Array<string>>>,
  cabinet?: Array<Array<Array<Array<cabinetInfo>>>>
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

export default function Lent(){
  const history = useHistory();
  const [user, setUser] = useState<userInfo>();
  const [l_idx, setLidx] = useState<number>(0);
  const [isLent, setisLent] = useState<number>(0);
  const [target, setTarget] = useState<number>(-1);
  const [cabiNum, setCabiNum] = useState<number>(-1);
  const [info, setInfo] = useState<locationInfo>({});
  const [lent, setLent] = useState<Array<lentInfo>>([]);

  useEffect(()=>{
    apiCheck();
    if (!info.location){
      handleClick();
    }
    handleLent();
  }, [l_idx, info]);

  const apiCheck = async () => {
    const url = "/api/check"
    await axios.post(url).then((res:any)=>{
      setUser(res.data.user);
    }).catch((err:any)=>{
      console.log(err);
			history.push("/");
		});
  };
  const handleLent = () => {
    const url = "/api/lent_info"
    axios.post(url).then((res:any)=>{
      setLent(res.data.lentInfo);
      setisLent(res.data.isLent);
    }).catch((err)=>{console.log(err)});
  };
  const handleClick = () => {
    const url = "/api/cabinet"
    axios.post(url).then((res:any)=>{
      setInfo(res.data);
    }).catch((err)=>{console.log(err)});
  };
  const navTabs = () => {
    if (!info || !info.floor || info.floor.length <= l_idx)
      return [];
    let list :Array<JSX.Element> = [];

    for (let i = 0; i < info.floor[l_idx].length; i++){
      let floor_name = info.floor[l_idx][i];
      list.push(
        <button className={`nav-link border border-bottom-0 px-4${i ? "" : " active"}`}
        id={`nav-tab`} key={`nav-${floor_name}-tab`} data-bs-toggle="tab" data-bs-target={`#nav-${floor_name}`}
        type="button" role="tab" aria-controls={`nav-${floor_name}`} aria-selected={i ? "false" : "true"}>
          {floor_name}F
        </button>
      );
    }
    return list;
  };
  const navContent = () => {
    let list = [];
    if (!info || !info.floor || info.floor.length <= l_idx)
      return [];
    for (let i = 0; i < info.floor[l_idx].length; i++){
      let floor_name = info.floor[l_idx][i];
      list.push(
        <Carousel setTarget={setTarget} setCabiNum={setCabiNum} info={info} l_idx={l_idx} outer_i={i} outer_lent={lent} floor_name={floor_name} isLent={isLent}></Carousel>
      );
    }
    return list;
  };

  return (
    <div className="container col" id="container">
      <div className="row align-items-center">
        <div className="col-6">
          <Location info={info} l_idx={l_idx} setLidx={setLidx}></Location>
        </div>
        <div className="col">
          <Menu url="/return"></Menu>
        </div>
      </div>
      <div className="row my-2 mx-2" >
          <nav>
            <div className="nav nav-tabs border-bottom-0" id="nav-tabs" role="tablist">
              {navTabs()}
            </div>
          </nav>
          <div className="tab-content" id="nav-tabContent">
            {navContent()}
          </div>
      </div>
      <LentModal target={target} cabiNum={cabiNum}></LentModal>
      <ContentsModal contents="이미 대여중인 사물함이 있어요 :)"/>
    </div>
  );
}
