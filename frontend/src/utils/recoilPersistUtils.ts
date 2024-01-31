export const deleteRecoilPersistFloorSection = () => {
  const recoilPersist = localStorage.getItem("recoil-persist");
  if (recoilPersist) {
    let recoilPersistObj = JSON.parse(recoilPersist);
    delete recoilPersistObj.CurrentFloor;
    delete recoilPersistObj.CurrentSection;
    localStorage.setItem("recoil-persist", JSON.stringify(recoilPersistObj));
  }
};
