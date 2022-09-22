import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { axiosReturn } from "../../../network/axios/axios.custom";

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
  lent_id: number;
  button_title: string;
}

const ReturnButton = (props: ReturnButtonProps): JSX.Element => {
  const { lent_id, button_title } = props;

  const navigate = useNavigate();

  const handleClick = (): void => {
    axiosReturn(lent_id)
      .then((response) => {
        navigate("/main");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return <Button onClick={handleClick}>{button_title}</Button>;
};

export default ReturnButton;
