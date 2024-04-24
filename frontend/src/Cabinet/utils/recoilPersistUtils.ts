// NOTE: 특정 페이지에서 새로고침 시 localStorage에 저장된 recoil-persist 로
//      저장된 floor의 cabinet 정보를 요청하지 못하도록 하기 위해 사용합니다.
export const deleteRecoilPersistFloorSection = () => {
  const recoilPersist = localStorage.getItem("recoil-persist");
  if (recoilPersist) {
    let recoilPersistObj = JSON.parse(recoilPersist);
    delete recoilPersistObj.CurrentFloor;
    delete recoilPersistObj.CurrentSection;
    localStorage.setItem("recoil-persist", JSON.stringify(recoilPersistObj));
  }
};
