import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { axiosV3Return } from "../../../network/axios/axios.custom";
import { setUserCabinet } from "../../../redux/slices/userSlice";
import { useAppDispatch } from "../../../redux/hooks";

const Button = styled.button`
  position: absolute;
  display: flex;
  color: #6667ab;
  font-size: 1.2rem;
  justify-content: center;
  align-items: center;
  width: 50%;
  height: 3rem;
  padding: 0.5rem;
  border: 0.2rem #6667ab solid;
  border-radius: 1rem;
  background-color: transparent;
`;

interface ReturnButtonProps {
  button_title: string;
}

const ReturnButton = (props: ReturnButtonProps): JSX.Element => {
  const { button_title } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClick = (): void => {
    axiosV3Return()
      .then((response) => {
        dispatch(setUserCabinet(-1));
        navigate("/main");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return <Button onClick={handleClick}>{button_title}</Button>;
};

export default ReturnButton;
