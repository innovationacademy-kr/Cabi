import React from "react";
import CabinetBox from "./CabinetBox";
import { cabinetInfo } from "../types/cabinetTypes";
import { SeromSecondFloor } from "./map/SeromSecondFloor";
import { SeromFloor } from "./map/SeromFloor";
import "./carousel.css";

export default function Carousel(props: any) {
  const cabinetBlock = (f_idx: number, s_idx: number) => {
    let list: Array<JSX.Element> = [];
    if (!props.info || !props.info.cabinet) return [];
    const cab: Array<cabinetInfo> =
      props.info.cabinet[props.l_idx][f_idx][s_idx];
    for (let i = 0; i < cab.length; i++) {
      var id = props.outer_lent.findIndex(
        (l: any) => l.lent_cabinet_id === cab[i].cabinet_id
      );
      list.push(
        <CabinetBox
          className="d-block w-100"
          setTarget={props.setTarget}
          setCabiNum={props.setCabiNum}
          setModalMessage={props.setModalMessage}
          key={`cab_box_${cab[i].cabinet_id}`}
          user={props.user}
          cabinet_id={cab[i].cabinet_id}
          cabinet_num={cab[i].cabinet_num}
          intra_id={id !== -1 ? props.outer_lent[id].intra_id : ""}
          isLent={props.isLent}
          expire_time={props.outer_lent[id]?.expire_time}
          activation={cab[i].activation}
        ></CabinetBox>
      );
    }
    return list;
  };
  const mapButton = () => {
    return (
      <span
        data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`}
        data-bs-slide-to={0}
        aria-current="true"
        aria-label="Slide 0"
      >
        <img className="mapImg" src="../../img/greenMap.png" alt="map" />
      </span>
    );
  };
  const mapIndicator = () => {
    return (
      <button
        className="indicator active"
        type="button"
        data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`}
        data-bs-slide-to={0}
        aria-current="true"
        aria-label="Slide 0"
      ></button>
    );
  };
  const navIndicator = (idx: number) => {
    let list: Array<JSX.Element> = [];
    if (
      !props.info ||
      !props.info.section ||
      props.info.section[props.l_idx].length <= idx
    )
      return [];
    list.push(mapIndicator());
    for (let i = 0; i < props.info.section[props.l_idx][idx].length; i++) {
      list.push(
        <button
          className="indicator"
          type="button"
          data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`}
          data-bs-slide-to={`${i + 1}`}
          aria-current="true"
          aria-label={`Slide ${i + 1}`}
        ></button>
      );
    }
    return list;
  };
  const mapSection = () => {
    return (
      <div
        className="carousel-item carousel-item active"
        key="carousel-item_map"
      >
        <div className="m-3 sectionName" key="label_map">
          MAP
        </div>
        <div className="mapWrapper mt-5 py-3">
          <React.Fragment>
            {props.floor_name === 2 ? (
              <SeromSecondFloor
                info={props.info}
                l_idx={props.l_idx}
                f_idx={props.outer_i}
                floor_name={props.floor_name}
                lent={props.lent}
              />
            ) : (
              <SeromFloor
                info={props.info}
                l_idx={props.l_idx}
                f_idx={props.outer_i}
                floor_name={props.floor_name}
                lent={props.lent}
              />
            )}
          </React.Fragment>
        </div>
      </div>
    );
  };
  const navSection = (idx: number) => {
    let list: Array<JSX.Element> = [];
    if (
      !props.info ||
      !props.info.section ||
      props.info.section[props.l_idx].length <= idx
    )
      return [];
    list.push(mapSection());
    for (let i = 0; i < props.info.section[props.l_idx][idx].length; i++) {
      list.push(
        <div
          className="carousel-item"
          key={`carousel-item_${props.info.section[props.l_idx][idx][i]}`}
        >
          <div
            className="m-3 sectionName"
            key={`label_${props.info.section[props.l_idx][idx][i]}`}
          >
            {props.info.section[props.l_idx][idx][i]} {mapButton()}
          </div>
          <div id="cabinetGrid">{cabinetBlock(idx, i)}</div>
        </div>
      );
    }
    return list;
  };

  return (
    <div
      className={`tab-pane${props.outer_i ? "" : " active"}`}
      id={`nav-${props.floor_name}`}
      key={`nav-${props.floor_name}`}
      role="tabpanel"
      aria-labelledby={`nav-${props.floor_name}-tab`}
    >
      <div
        id={`carousel_${props.l_idx}_${props.floor_name}`}
        className="carousel slide"
        data-bs-touch="true"
        data-bs-ride="carousel"
        data-bs-interval="false"
      >
        <div className="carousel-indicators">{navIndicator(props.outer_i)}</div>
        <div className="carousel-inner" key={`nav-inner${props.floor_name}`}>
          {navSection(props.outer_i)}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`}
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`}
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
