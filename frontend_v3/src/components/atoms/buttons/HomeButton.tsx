import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  background: url("/img/cabinet.ico") no-repeat;
  background-size: contain;
  border: 0;
  outline: 0;
`;

const HomeButton = (): JSX.Element => {
  const navigate = useNavigate();

  const handleClick = (): void => {
    navigate("/main");
  };

  return <Button onClick={handleClick} />;
};

export default HomeButton;
