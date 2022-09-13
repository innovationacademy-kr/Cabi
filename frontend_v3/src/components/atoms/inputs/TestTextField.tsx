import React, { useState } from "react";
import styled from "@emotion/styled";
import EditButton from "./EditButton";

// TODO: gyuwlee(?)
// 본 테스트 필드 제거하고, Organism 단위로 텍스트 입력 필드 구현
// 근데 이것도 제대로 작동하긴 합니당

const Container = styled.div`
  display: flex;
  justify-content: left;
  align-items: center;
`;

const TestTextField = (): JSX.Element => {
  const [value, setValue] = useState("");
  const [isToggle, setIsToggle] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  return (
    <Container>
      {isToggle === false ? (
        <p>{value}</p>
      ) : (
        <input type="text" onChange={handleChange} />
      )}
      <EditButton isToggle={isToggle} setIsToggle={setIsToggle} value={value} />
    </Container>
  );
};

export default TestTextField;
