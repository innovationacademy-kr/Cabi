import './return.css'
import './main.css'
import Menu from '../component/Menu'
import ReturnModal from '../modal/ReturnModal'
import axios from 'axios'
import { useState, useEffect } from 'react'

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

export default function Return(){
  const local_url = "http://localhost:4242/api/return_info"
  const dev_url = "/api/return_info"
  const [lentCabinet, setLentCabinet] = useState<lentCabinetInfo>();

  const callReturn = () => {
    axios.post(local_url, {user_id : 1}).then((res:any)=>{
      console.log(res.data);
      setLentCabinet(res.data.lentCabinet);
    }).catch((err)=>{console.log(err)});
  }

  // callReturn();
  useEffect(()=>{
    axios.post('http://localhost:4242/api/check').catch((err:any)=>{
      console.log(err);
      window.location.href = 'http://localhost:3000/';
    });
    console.log(lentCabinet?.lent_id);
    if (lentCabinet?.lent_id === -1 || lentCabinet?.lent_id === undefined)
      callReturn();
  }, [lentCabinet]);

  return (
    <div className="container" id='container'>
      <div className="row-2">
      <Menu url="/lent"></Menu>
      </div>
      <div className="card row-2 p-5 m-5">
        <div className="card-body p-5 my-5">
          <div className="card-title text-center display-5">{lentCabinet?.location} {lentCabinet?.floor}F {lentCabinet?.lent_cabinet_id}</div>
          <div className="card-subtitle mb-2 text-muted text-center">~ {lentCabinet?.expire_time}</div>
        </div>
      </div>
      <div className="row-2 d-grid gap-2 col-6 mx-auto m-5">
        <div className="btn btn-lg" id="colorBtn" data-bs-toggle="modal" data-bs-target="#returnmodal">
          반납하기
        </div>
      </div>
      <div className="row-2 d-grid gap-2 col-6 mx-auto m-5">
        <div className="btn btn-lg disabled" id="colorBtn">
          연장하기
        </div>
      </div>
      <ReturnModal lentCabinet={lentCabinet}></ReturnModal>
    </div>
  )
}
