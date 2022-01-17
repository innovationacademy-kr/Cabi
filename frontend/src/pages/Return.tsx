import './return.css'
import './main.css'
import Menu from '../component/Menu'
import ReturnModal from '../modal/ReturnModal'
import axios from 'axios'
import { useState, useEffect } from 'react'
import React from 'react'

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

export default function Return() {
  const local_url = "http://localhost:2424/api/return_info"
  const dep_url = "/api/return_info"
  const [lentCabinet, setLentCabinet] = useState<lentCabinetInfo>();
  
  useEffect(() => {
    callReturn();
  }, []);
  
  // callReturn();
  const callReturn = async () => {
    await axios.post(dep_url, { user_id: 1 }).then((res: any) => {
      console.log(res);
      if (res.status === 200){
        setLentCabinet(res.data.lentCabinet);
      }
    }).catch((err) => { console.log(err) });
  }

  return (
    <div className="container" id='container'>
      <div className="row-2">
        <Menu url="/lent"></Menu>
      </div>
      <div className="card row-2 p-5 m-5">
        <div className="card-body p-5 my-5">
          <React.Fragment>
            {
              lentCabinet?.lent_id === -1 ? <div className="card-subtitle mb-2 text-muted text-center">현재 대여중인 사물함이 없습니다.</div> :
                <div>
                  <div className="card-title text-center display-5">{lentCabinet?.location} {lentCabinet?.floor}F {lentCabinet?.lent_cabinet_id}</div>
                  <div className="card-subtitle mb-2 text-muted text-center">~ {lentCabinet?.expire_time}</div>
                </div>
            }
          </React.Fragment>
        </div>
      </div>
      <React.Fragment>
        {
          lentCabinet?.lent_id === -1 ? <div></div> :
            <div>
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
            </div>
        }
      </React.Fragment>
      <ReturnModal lentCabinet={lentCabinet}></ReturnModal>
    </div>
  )
}
