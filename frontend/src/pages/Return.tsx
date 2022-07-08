import axios from "axios";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Menu from "../component/Menu";
import ReturnModal from "../modal/ReturnModal";
import PasswordModal from "../modal/PasswordModal";
import ContentsModal from "../modal/ContentsModal";
import ExtensionModal from "../modal/ExtensionModal";
// import ReturnEventModal from "../modal/ReturnEventModal";
import { userInfo } from "../types/userTypes";
import { lentCabinetInfo } from "../types/cabinetTypes";
import "./main.css";
import "./return.css";

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
  // const [isEventWinner, setEventWinner] = useState<boolean>(false);

  useEffect(() => {
    apiCheck().then(() => {
      callReturn();
      // checkEvent();
    });
  }, [content, path, extension]);

  const apiCheck = async () => {
    await axios
      .post("/api/check")
      .then((res: any) => {
        setUser(res.data.user);
      })
      .catch((err: any) => {
        console.error(err);
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
          let extention = "";
          if (res.data) {
            const date:Date = new Date(res.data.expire_time);
            const nowDate:Date = new Date();
            nowDate.setDate(nowDate.getDate() + 7);
            date.setDate(date.getDate() + 1);
            date.setHours(0, 0, 0);
            if ((date > nowDate) || (res.data.extension > 0)){
              extention = "disabled";
            }
            else if (res.data.lent_id === - 1) {
              extention = "hidden";
            }
          }
          setExtension(extention);
          //console.log(res.data);
          if (res.data){
            const date:Date = new Date(res.data.expire_time);
            date.setDate(date.getDate() + 1);
            date.setHours(0, 0, 0);
            //console.log(date);
            setisExpired(res.data && date < new Date());
          } else {
            setisExpired(false);
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleHome = () => {
    navigate("/lent");
  };

  // const checkEvent = async () => {
  //   await axios
  //   .get("/api/event/winner")
  //   .then((res) => {
	// 		setEventWinner(res.data.winner);
	// 	});
  // };

  return (
    <div className="container" id="container">
      {/* Event Modal */}
      {/* {isEventWinner ? <ReturnEventModal /> : null} */}
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
                  {lentCabinet?.location} {lentCabinet?.floor}{"F "}
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
    </div>
  );
}
