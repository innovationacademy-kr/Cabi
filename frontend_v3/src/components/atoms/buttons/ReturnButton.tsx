import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { setUserCabinet } from "../../../redux/slices/userSlice";
import { useAppDispatch } from "../../../redux/hooks";

const Button = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  font-size: 1rem;
  width: 12rem;
  height: 2rem;
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

  return <Button className="ReturnButton">{button_title}</Button>;
};

export default ReturnButton;
