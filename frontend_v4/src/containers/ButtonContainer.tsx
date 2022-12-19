import React from 'react';
import styled from 'styled-components';

interface ButtonInterface {
    onClick(event : React.MouseEvent<HTMLButtonElement>): void;
    text : string;
    theme : string;
}

const ButtonContainer = (props: ButtonInterface) => {
    return <ButtonContainerStyled theme={props.theme}>{props.text}</ButtonContainerStyled>
}

const ButtonContainerStyled = styled.button`
    width : 200px;
    height : 60px;
    display : flex;
    justify-content : center;
    align-items : center;
    background : ${props => props.theme === "dark" ? "#9747FF" : "white"};
    color : ${props => props.theme === "dark" ? "white" : "#9747FF" };
    border : ${props => props.theme === "dark" ? "1px solid white" : "1px solid #9747FF"};
    border-radius : 10px;
    margin-bottom: 15px;
`

export default ButtonContainer;