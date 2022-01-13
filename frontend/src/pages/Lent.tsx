import axios from 'axios'
import Location from '../component/Location'
import Menu from '../component/Menu'
import LentModal from '../modal/LentModal'
import './lent.css'
import './main.css'
import CabinetBox from '../component/CabinetBox'
import {useState, useEffect} from 'react'
import Carousel from '../component/Carousel'

export type cabinetInfo = {
  cabinet_id: number,
  cabinet_num: number,
  location: string,
  floor: number,
  section: string,
  activation: boolean,
}
//one location - ex) 새롬
export type locationInfo = {
  location?: Array<string>,
  floor?: Array<Array<number>>,
  section?: Array<Array<Array<string>>>,
  cabinet?: Array<Array<Array<Array<cabinetInfo>>>>
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

export default function Lent(){
    const [l_idx, setLidx] = useState<number>(0);
    const [info, setInfo] = useState<locationInfo>({});
    const [lent, setLent] = useState<Array<lentInfo>>([]);
    const [target, setTarget] = useState<number>(-1);

    useEffect(()=>{
      if (!info.location){
        console.log('info');
        handleClick();
      }
      if (!lent[0]){
        console.log('lent');
        handleLent();
      }
    }, [l_idx, info]);

    const handleLent = () => {
      const dev_url = "http://localhost:4242/api/lent_info"
      axios.post(dev_url).then((res:any)=>{
        setLent(res.data);
      }).catch((err)=>{console.log(err)});
    }
    const handleClick = () => {
      const dev_url = "http://localhost:4242/api/cabinet"
      axios.post(dev_url).then((res:any)=>{
        setInfo(res.data);
      }).catch((err)=>{console.log(err)});
    }

    const navTabs = () => {
      let list = [];
      if (!info || !info.floor || info.floor.length <= l_idx)
        return [];
      for (let i = 0; i < info.floor[l_idx].length; i++){
        let floor_name = info.floor[l_idx][i];
        list.push(
          <button className={`nav-link border border-bottom-0 px-4${i ? '' :' active'}`}
          id={`nav-tab`} key={`nav-${floor_name}-tab`} data-bs-toggle="tab" data-bs-target={`#nav-${floor_name}`}
          type="button" role="tab" aria-controls={`nav-${floor_name}`} aria-selected={i ? 'false' : 'true'}>
            {floor_name}
          </button>
        );
      }
      return list;
    }
    const navContent = () => {
      let list = [];
      if (!info || !info.floor || info.floor.length <= l_idx)
        return [];
      for (let i = 0; i < info.floor[l_idx].length; i++){
        let floor_name = info.floor[l_idx][i];
        list.push(
          <Carousel setTarget={setTarget} info={info} l_idx={l_idx} outer_i={i} outer_lent={lent} floor_name={floor_name}></Carousel>
        );
      }
      return list;
    }

    return (
        <div className="container col" id="container">
            <div className="row align-items-center">
              <div className="col-6">
                <Location></Location>
              </div>
              <div className="col">
                <Menu></Menu>
              </div>
            </div>
            <div className="row my-2 mx-2" >
                <nav>
                  <div className="nav nav-tabs border-bottom-0" id="nav-tabs" role="tablist">{navTabs()}</div>
                </nav>
                <div className="tab-content" id="nav-tabContent">{navContent()}</div>
                <LentModal></LentModal>
            </div>
        </div>
    );
}
