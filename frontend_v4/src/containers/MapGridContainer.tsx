import React from 'react';
import styled from 'styled-components';

/*
    클러스터 사물함 위치 더미 데이터
    grid col : 가로 , grid row : 세로

    colStart : grid 가로 시작 위치 1부터 시작 
    colEnd   : grid 가로 마지막 위치
    rowStart : grid 세로 시작 위치 2부터 시작
    rowEnd   : grid 세로 마지막 위치
    name     : 사물함 이름 정보
    type     : 사물함과 엘레베이터 타입 구분자
*/
const data : IFloorMapInfo[] = [
    {
        colStart : 1,
        colEnd : 3,
        rowStart : 1,
        rowEnd : 2,
        name : `End of Clustor 6`,
        type : "cabinet"
    },
    {
        colStart : 1,
        colEnd : 3,
        rowStart : 3,
        rowEnd : 4,
        name : `Oasis`,
        type : "cabinet"
    },
    {
        colStart : 1,
        colEnd : 2,
        rowStart : 4,
        rowEnd : 5,
        name : `E/V`,
        type : "elevator"
    },
    {
        colStart : 4,
        colEnd : 6,
        rowStart : 6,
        rowEnd : 7,
        name : `Cluster 5
        -
        OA`,
        type : "cabinet"
    },
    {
        colStart : 4,
        colEnd : 6,
        rowStart : 8,
        rowEnd : 9,
        name : `End of Clustor 5`,
        type : "cabinet"
    }
]

interface IFloorMapInfo {
    rowStart : number;
    rowEnd : number;
    colStart : number;
    colEnd : number;
    name : string;
    type : string;
}

const MapGridContainer = () => {
    return <MapGridStyled>
    {data.map((value, idx) => <MapItem key={idx} info={value} />)}
</MapGridStyled>
}


const MapItem:React.FC<{info : IFloorMapInfo}> = (props) => {
    return <ItemStyled info={props.info}>
                {props.info.name}
            </ItemStyled>
}

const ItemStyled = styled.div<{ info : IFloorMapInfo }>`
    font-size : 0.8rem;
    cursor : pointer;
    color : white;
    display: flex;
    justify-content: center;
    align-items : center;
    border-radius : 10px;
    grid-column-start: ${({ info })=> info.colStart};
    grid-column-end: ${({ info })=> info.colEnd};
    grid-row-start: ${({ info })=> info.rowStart};
    grid-row-end: ${({ info })=> info.rowEnd};
    background : ${(({ info }) => info.type === "cabinet" ? "#9747ff" : "#bcb9b9")}
`

const MapGridStyled = styled.div`
    width : 80%;
    height: 580px;
    background : #e7e7e7;
    display : grid;
    grid-template-columns : repeat(5, 1fr);
    grid-template-rows : repeat(8, 1fr);
    gap : 0px;
`

export default MapGridContainer;
