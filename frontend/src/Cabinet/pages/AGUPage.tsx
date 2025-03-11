import { useRef } from "react";
import { axiosAGU } from "../api/axios/axios.custom";

const AGUPage = () => {
  const idRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = async () => {
    try {
      if (idRef.current) {
        const id = idRef.current.value;
        await axiosAGU(id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      AGUPage
      <input ref={idRef} style={{ border: "1px solid black" }}></input>
      <button onClick={handleButtonClick}>버튼</button>
    </>
  );
};

export default AGUPage;
