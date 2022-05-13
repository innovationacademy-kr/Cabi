import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { userInfo } from "./Main";
import Menu from "../component/Menu";
import ReturnModal from "../modal/ReturnModal";
import PasswordModal from "../modal/PasswordModal";
import ContentsModal from "../modal/ContentsModal";
import ExtensionModal from "../modal/ExtensionModal";
import "./main.css";
import "./return.css";
import ReturnEventModal from "../modal/ReturnEventModal";

export type eventInfo = {
  event_id: number,
  event_name: string,
  intra_id: string,
  isEvent: boolean
};

export type lentCabinetInfo = {
  lent_id: number;
  lent_cabinet_id: number;
  lent_user_id: number;
  lent_time: string;
  expire_time: string;
  extension: number;
  cabinet_num: number;
  location: string;
  floor: number;
  section: string;
  activation: boolean;
};

export default function Return() {
  const navigate = useNavigate();
  const [user, setUser] = useState<userInfo>();
  const [path, setPath] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [cabinetPassword, setCabinetPassword] = useState<string>("");
  const [lentCabinet, setLentCabinet] = useState<lentCabinetInfo>();
  const [extension, setExtension] = useState<string>(
    lentCabinet?.lent_id === -1
      ? "hidden"
      : lentCabinet && lentCabinet.extension > 0
      ? "disabled"
      : ""
  );
  const [isExpired, setisExpired] = useState<boolean>(false);

  useEffect(() => {
    apiCheck().then(() => {
      callReturn();
    });
  }, [content, path, extension]);

  const apiCheck = async () => {
    await axios
      .post("/api/check")
      .then((res: any) => {
        setUser(res.data.user);
      })
      .catch((err: any) => {
        console.log(err);
        navigate("/");
      });
  };
  const callReturn = async () => {
    await axios
      .post("/api/return_info")
      .then((res: any) => {
        // 특정 사용자가 현재 대여하고 있는 사물함의 정보
        if (res.status === 200) {
          setLentCabinet(res.data);
<<<<<<< HEAD
					if (res.data){
						const date:Date = new Date(res.data.expire_time);
						date.setDate(date.getDate() + 1);
            date.setHours(0, 0, 0);
						setisExpired(date < new Date());
=======
					//console.log(res.data);
					if (res.data){
						const date:Date = new Date(res.data.expire_time);
						date.setDate(date.getDate() + 1);
						date.setHours(0, 0, 0);
						//console.log(date);
						setisExpired(res.data && date < new Date());
>>>>>>> dev
					} else {
						setisExpired(false);
					}
          setExtension(
            res.data.lent_id === -1
              ? "hidden"
              : res.data.extension > 0
              ? "disabled"
              : ""
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleHome = () => {
    navigate("/lent");
  };
  return (
    <div className="container" id="container">
      {/* 상단바 */}
      <div className="row align-items-center">
        <div className="col">
          <div className="px-4">
            <img src="../img/cabinet.ico" onClick={handleHome} width="30" />
          </div>
        </div>
        <div className="col">
          <Menu url="/lent"></Menu>
        </div>
      </div>
      {/* 새롬관 2F 148 ~2022-03-07 메모장 */}
      <div
        className={`card row-2 p-5 m-5 ${
          typeof lentCabinet?.lent_id === "number" && isExpired == true
            ? "expiredView"
            : ""
        } `}
      >
        <div className="card-body my-5" id="card-body">
          <React.Fragment>
            {lentCabinet?.lent_id === -1 ? (
              <div className={`card-subtitle mb-2 text-muted text-center`}>
                현재 대여중인 사물함이 없습니다.
              </div>
            ) : (
              <div>
                <div className="card-title text-center display-5">
                  {lentCabinet?.location} {lentCabinet?.floor}{" "}
                  {lentCabinet?.cabinet_num}
                </div>
                <div className="card-subtitle mb-2 text-muted text-center">
                  ~ {lentCabinet?.expire_time}
                </div>
              </div>
            )}
            {localStorage.getItem("cabinetPassword") ? (
              <div className="text-center" id="passwordtext">
                [ {localStorage.getItem("cabinetPassword")} ]
              </div>
            ) : (
              <div className="text-center" id="passwordtext">
                {" "}
                &lt; 비밀스러운 메모장 &gt;{" "}
              </div>
            )}
          </React.Fragment>
        </div>
      </div>
      <div>
        <div className="row-2 d-grid gap-2 col-6 mx-auto m-5">
          <div
            className={`btn btn-lg ${
              lentCabinet?.lent_id === -1 ? "hidden" : ""
            }`}
            id="colorBtn"
            data-bs-toggle="modal"
            data-bs-target="#returnmodal"
          >
            반납하기
          </div>
        </div>
        <div className="row-2 d-grid gap-2 col-6 mx-auto m-5">
          <div
            className={`btn btn-lg ${
              lentCabinet?.lent_id === -1 ? "hidden" : ""
            }`}
            id="colorBtn"
            data-bs-toggle="modal"
            data-bs-target="#passwordmodal"
          >
            비밀번호 메모장
          </div>
        </div>
        <div className={`row-2 d-grid gap-2 col-6 mx-auto m-5`}>
          <div
            className={`btn btn-lg ${extension} ${isExpired ? "disabled" : ""}`}
            id="colorBtn"
            data-bs-toggle="modal"
            data-bs-target="#extensionmodal"
          >
            연장하기
          </div>
        </div>
      </div>
      <ReturnModal
        user={user}
        lentCabinet={lentCabinet}
        setContent={setContent}
        setPath={setPath}
      ></ReturnModal>
      <PasswordModal
        cabinetPassword={cabinetPassword}
        setCabinetPassword={setCabinetPassword}
      ></PasswordModal>
      <ContentsModal contents={content} path={path}></ContentsModal>
      <ExtensionModal setContent={setContent}></ExtensionModal>
      <ReturnEventModal></ReturnEventModal>
    </div>
  );
}
