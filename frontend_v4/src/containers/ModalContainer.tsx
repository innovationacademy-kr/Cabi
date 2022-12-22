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
    return  <BackgroundStyled>
                <ModalConatinerStyled type={props.type}>
                        <img src={props.type === "confirm" ? checkIcon : errorIcon} style={{width :'70px', marginBottom : '20px'}}/>
                        <H2Styled>{props.title}</H2Styled>
                        <DetailStyled>{props.detail}</DetailStyled>
                        {props.type === "confirm"
                            ? <ButtonContainer onClick={(e : any)=>e} text="취소" theme="white"/> 
                            : null}
                        {props.type === "confirm"
                            ? <ButtonContainer onClick={(e : any)=>e} text={props.confirmMessage} theme="dark"/> 
                            : null}
                    </ ModalConatinerStyled>
            </BackgroundStyled>
}

const ModalConatinerStyled = styled.div<{ type : string }>`
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
    padding-bottom : ${({ type }) => type === 'error' ? 0 : "10px"}
`

const DetailStyled = styled.p`
    margin-bottom: 30px;
`

const H2Styled = styled.h2`
    font-weight : 600;
    font-size : 1.5rem;
    margin-bottom : 30px;
`

const BackgroundStyled = styled.div`
    position : absolute;
    left : 0;
    top : 0;
    width : 100vw;
    height : 100vh;
    background : rgba(0, 0, 0, .4);
    display : flex;
    justify-content : center;
    align-items : center;
    z-index : 10;
`

export default ModalContainer;
