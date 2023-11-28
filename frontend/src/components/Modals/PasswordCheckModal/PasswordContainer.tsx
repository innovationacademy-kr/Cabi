import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const PasswordContainer = ({
  onChange,
  password,
  tryLentRequest,
}: {
  onChange: React.ChangeEventHandler;
  password: string;
  tryLentRequest?: () => void;
}) => {
  const [list, setList] = useState(["", "", "", ""]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onClick = () => {
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    const temp = [...password.split("")];
    for (let i = 0; i < 4 - password.length; i++) {
      temp.push("");
    }
    setList([...temp]);
    if (inputRef.current) inputRef.current.focus();
  }, [password]);

  const handleEnterPress = () => {
    console.log(password.length);
    if (tryLentRequest && password.length == 4) tryLentRequest();
  };

  return (
    <>
      <PasswordStyled>
        {list.map((val, idx) => (
          <PasswordNumber
            className={idx === 0 && val === "" ? "active" : ""}
            onClick={onClick}
            key={idx}
            val={val}
          >
            {val}
          </PasswordNumber>
        ))}
      </PasswordStyled>
      <Input
        ref={inputRef}
        onChange={onChange}
        maxLength={4}
        onKeyUp={(e: any) => {
          if (e.key === "Enter") {
            handleEnterPress();
          }
        }}
      />
    </>
  );
};

const Input = styled.input`
  height: 0;
  color: transparent;
  caret-color: transparent;
`;

const PasswordNumber = styled.div<{ val: string }>`
  width: 20%;
  height: 100%;
  border-radius: 10px;
  border: ${({ val }) =>
    val ? "2px solid var(--main-color)" : "1px solid var(--lightpurple-color)"};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: var(--main-color);
  &.active {
    border: 2px solid var(--main-color);
  }
`;

const PasswordStyled = styled.div`
  width: 240px;
  height: 60px;
  margin: 0 auto;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default PasswordContainer;
