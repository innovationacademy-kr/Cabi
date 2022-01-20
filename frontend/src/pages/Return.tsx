import './return.css'
import './main.css'
import Menu from '../component/Menu'
import ReturnModal from '../modal/ReturnModal'
import axios from 'axios'
import { userInfo } from './Main'
import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import ContentsModal from '../modal/ContentsModal'

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
  const url = "/api/return_info"
	const history = useHistory();
  const [lentCabinet, setLentCabinet] = useState<lentCabinetInfo>()  
  const [user, serUser] = useState<userInfo>();
  const [content, setContent] = useState<string>('');
  const [path, setPath] = useState<string>('');

  useEffect(() => {
	  apiCheck().then(async (res:any)=>{
      await callReturn();
    });
  }, [content, path]);

  const apiCheck = async () => {
    await axios.post('/api/check').then((res:any)=>{
      serUser(res.data.user);
    }).catch((err:any)=>{
      console.log(err);
			history.push('/');
		});
  }
  const callReturn = async () => {
    await axios.post(url, { user: user?.user_id }).then((res: any) => {
      if (res.status === 200){
        setLentCabinet(res.data);
      }
    }).catch((err) => { console.log(err) });
  }

  return (
    <div className="container" id='container'>
      <div className="row-2">
        <Menu url="/lent"></Menu>
      </div>
      <div className="card row-2 p-5 m-5">
        <div className="card-body my-5" id="card-body">
          <React.Fragment>
            {
              lentCabinet?.lent_id === -1 ? <div className="card-subtitle mb-2 text-muted text-center">현재 대여중인 사물함이 없습니다.</div> :
                <div>
                  <div className="card-title text-center display-5">{lentCabinet?.location} {lentCabinet?.floor}F {lentCabinet?.cabinet_num}</div>
                  <div className="card-subtitle mb-2 text-muted text-center">~ {lentCabinet?.expire_time}</div>
                </div>
            }
          </React.Fragment>
        </div>
      </div>
        <div>
          <div className="row-2 d-grid gap-2 col-6 mx-auto m-5">
            <div className={`btn btn-lg ${lentCabinet?.lent_id === -1 ? 'hidden': ''}`} id="colorBtn" data-bs-toggle="modal" data-bs-target="#returnmodal">
              반납하기
            </div>
          </div>
          <div className="row-2 d-grid gap-2 col-6 mx-auto m-5">
            <div className={`btn btn-lg ${lentCabinet?.lent_id === -1 ? 'hidden': 'disabled'}`} id="colorBtn">
              연장하기
            </div>
          </div>
        </div>
      <ReturnModal lentCabinet={lentCabinet} setContent={setContent} setPath={setPath}></ReturnModal>
      <ContentsModal contents={content} path={path}></ContentsModal>
    </div>
  )
}
