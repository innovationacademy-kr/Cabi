import axios from 'axios'
import Location from '../component/Location' 
import Menu from '../component/Menu'
// import LentModal from '../modal/LentModal'
import './lent.css'
import './main.css'
import CabinetBox from '../component/CabinetBox'
import {useState, useEffect} from 'react'

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
          <button className={`nav-link border px-4${i ? '' :' active'}`} id={`nav-${floor_name}-tab`} key={`nav-${floor_name}-tab`} data-bs-toggle="tab" data-bs-target={`#nav-${floor_name}`} type="button" role="tab" aria-controls={`nav-${floor_name}`} aria-selected={i ? 'false' : 'true'}>
            {floor_name}
          </button>
        );
      }
      return list;
    }
    // const navContent = () => {
    //   let list = [];
    //   if (!info || !info.floor || info.floor.length <= l_idx)
    //     return [];
    //   for (let i = 0; i < info.floor[l_idx].length; i++){
    //     let floor_name = info.floor[l_idx][i];
    //     list.push(
    //       <div className={`tab-pane${i ? '' : ' active'}`} id={`nav-${floor_name}`} key={`nav-${floor_name}`} role="tabpanel" aria-labelledby={`nav-${floor_name}-tab`}>
    //         {navSection(i)}
    //       </div>
    //     );
    //   }
    //   return list;
    // }

    // const navSection = (idx:number) => {
    //   let list = [];
    //   if (!info || !info.section || info.section[l_idx].length <= idx)
    //     return [];
    //   // console.log(info.section[l_idx][idx].length);
    //   for (let i = 0; i < info.section[l_idx][idx].length; i++){
    //     list.push(
    //       <div key={`nav_section_${info.section[l_idx][idx][i]}`}>
    //         <label className="m-3" key={`label_${info.section[l_idx][idx][i]}`}>{info.section[l_idx][idx][i]}</label>
    //         <div className="row mx-1" key={`block_${info.section[l_idx][idx][i]}`}>
    //           {cabinetBlock(idx, i)}
    //         </div>
    //       </div>
    //     );
    //   }
    //   return list;
    // }


    // 상단의 두 컴포넌트 코드가 carousel 적용시도 전 코드입니다! 이하 코드는 적용 중 코드!

    const navContent = () => {
      let list = [];
      if (!info || !info.floor || info.floor.length <= l_idx)
        return [];
      for (let i = 0; i < info.floor[l_idx].length; i++){
        let floor_name = info.floor[l_idx][i];
        list.push(
          // <div className={`tab-pane${i ? '' : ' active'}`} id={`nav-${floor_name}`} key={`nav-${floor_name}`} role="tabpanel" aria-labelledby={`nav-${floor_name}-tab`}>
          //   {navSection(i)}
          // </div>
          <div className={`tab-pane${i ? '' : ' active'}`} id={`nav-${floor_name}`} key={`nav-${floor_name}`} role="tabpanel" aria-labelledby={`nav-${floor_name}-tab`}>
            <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner" key={`nav-inner${floor_name}`}>
                {navSection(i)}
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        );
      }
      return list;
    }

    const navSection = (idx:number) => {
      let list = [];
      if (!info || !info.section || info.section[l_idx].length <= idx)
        return [];
      // console.log(info.section[l_idx][idx].length);
      for (let i = 0; i < info.section[l_idx][idx].length; i++){
        list.push(
          // <div key={`nav_section_${info.section[l_idx][idx][i]}`}>
          //   <label className="m-3" key={`label_${info.section[l_idx][idx][i]}`}>{info.section[l_idx][idx][i]}</label>
          //   <div className="row mx-1" key={`block_${info.section[l_idx][idx][i]}`}>
          //     {cabinetBlock(idx, i)}
          //   </div>
          // </div>
          <div className={`carousel-item${i ? '' : ' active'}`}>
            {cabinetBlock(idx, i)}
          </div>

        );
      }
      return list;
    }


    // 여기까지가 carousel 적용시도 중 코드입니다!

    const cabinetBlock = (f_idx:number, s_idx:number) => {
      if (!info || !info.cabinet)
        return [];
      let list = [];
      const cab:Array<cabinetInfo> = info.cabinet[l_idx][f_idx][s_idx];
      for (let i = 0; i < cab.length; i++){
        const id= lent.find((l)=>l.lent_cabinet_id === cab[i].cabinet_id);
        list.push(
          <CabinetBox className="d-block w-100" key={`cab_box_${cab[i].cabinet_id}`} cabinet_id={cab[i].cabinet_num} intra_id={id ? id.intra_id : ""}></CabinetBox>
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
                  <div className="nav nav-tabs" id="nav-tab" role="tablist">{navTabs()}</div>
                </nav>

                <div className="tab-content" id="nav-tabContent">{navContent()}</div>
            </div>
        </div>
    );
}
