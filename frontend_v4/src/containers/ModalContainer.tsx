import React from 'react';
import styled from 'styled-components';
import checkIcon from '@/assets/images/checkIcon.svg';
import errorIcon from '@/assets/images/errorIcon.svg';
import ButtonContainer from './ButtonContainer';

interface ModalInterface {
    type : string;
    title : string | null;
    detail : string | null;
    confirmMessage : string;
}

const ModalContainer = (props : ModalInterface) => {
    return <ModalConatinerStyled>
            <img src={props.type === "confirm" ? checkIcon : errorIcon} />
            <h2>{props.title}</h2>
            <p>{props.detail}</p>
            {props.type === "confirm"
                ? <ButtonContainer onClick={(e)=>e} text="취소" theme="white"/> 
                : null}
            {props.type === "confirm"
                ? <ButtonContainer onClick={(e)=>e} text={props.confirmMessage} theme="dark"/> 
                : null}
        </ ModalConatinerStyled>
} 

const ModalConatinerStyled = styled.div`
    width : 360px;
    background : white;
    color : black;
    border-radius : 10px;
    display : flex;
    flex-direction : column;
    justify-content : space-around;
    align-items : center;
    text-align : center;
    padding : 30px 0 10px 0;
`

export default ModalContainer;