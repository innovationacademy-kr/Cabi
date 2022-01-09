import CabinetBox from './CabinetBox'
import './carousel.css'
import { cabinetInfo } from '../pages/Lent'

export default function Carousel(props:any){
  const cabinetBlock = (f_idx:number, s_idx:number) => {
    if (!props.info || !props.info.cabinet)
      return [];
    let list = [];
    const cab:Array<cabinetInfo> = props.info.cabinet[props.l_idx][f_idx][s_idx];
    for (let i = 0; i < cab.length; i++){
      const id= props.outer_lent.find((l:any)=>l.lent_cabinet_id === cab[i].cabinet_id);
      list.push(
        <CabinetBox className="d-block w-100" key={`cab_box_${cab[i].cabinet_id}`} cabinet_id={cab[i].cabinet_num} intra_id={id ? id.intra_id : ""}></CabinetBox>
      );
    }
    return list;
  }

  const navSection = (idx:number) => {
    let list = [];
    if (!props.info || !props.info.section || props.info.section[props.l_idx].length <= idx)
      return [];
    console.log(props.info.section[props.l_idx][idx].length);
    for (let i = 0; i < props.info.section[props.l_idx][idx].length; i++){
      list.push(
        <div className={`carousel-item${i ? '' : ' active'}`} key={`carousel-item_${props.info.section[props.l_idx][idx][i]}`} >
          <label className="m-3" key={`label_${props.info.section[props.l_idx][idx][i]}`}>{props.info.section[props.l_idx][idx][i]}</label>
          {cabinetBlock(idx, i)}
        </div>
      );
    }
    return list;
  }

  return (
    <div className={`tab-pane${props.outer_i ? '' : ' active'}`} id={`nav-${props.floor_name}`} key={`nav-${props.floor_name}`} role="tabpanel" aria-labelledby={`nav-${props.floor_name}-tab`}>
      <div id={`carousel_${props.l_idx}_${props.floor_name}`} className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner" key={`nav-inner${props.floor_name}`}>
          {navSection(props.outer_i)}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
