import React from 'react';
import styled from 'styled-components';
import exitButton from '@/assets/images/exitButton.svg';
import MapGridContainer from './MapGridContainer';

const FloorSelectContainer = () => {
    return <SelectStyled name="floor">
        <option defaultValue="2층" value="2층">2층</option>
        <option value="3층">3층</option>
        <option value="4층">4층</option>
    </SelectStyled>
}

const MapInfoContainer = () => {
    return <MapInfoContainerStyled>
        <HeaderStyled>
            <H2Styled>지도</H2Styled>
            <img src={exitButton} style={{ width : '24px', cursor : "pointer" }} />
        </HeaderStyled>
        <FloorSelectContainer />
        <MapGridContainer />
    </MapInfoContainerStyled>
}

const H2Styled = styled.h2`
    font-size:1.5rem;
`

const SelectStyled = styled.select`
    background : var(--main-color);
    padding : 5px 10px;
    border-radius : 5px;
    margin-bottom : 50px;
    & > option {
        background : var(--main-color);
        padding : 5px 10px;
        border-radius : 5px;
    }
`

const HeaderStyled  = styled.div`
    display : flex;
    justify-content : space-between;
    width : 100%;
    align-items: center;
    padding : 40px 20px 40px 40px;
    color : black;
    font-weight : bold;
`

const MapInfoContainerStyled = styled.div`
    width : 330px;
    /* height : 100%; */
    height : 840px;
    display : flex;
    flex-direction : column;
    align-items : center;
    background : var(--white);
`

export default MapInfoContainer;
