import "./seromFloor.css"

export function SeromFloor(props:any){
    const cluster1:number = props.floor_name === 4 ? 3 : 5;
    const cluster2:number = props.floor_name === 4 ? 4 : 6;

    return (
        <div className="seromFloor">
            <div className="blank"></div>
            <div className="oa">OA</div>
            <div className="eoc1">End of Cluster{cluster1}</div>
            <div className="eoc2">End of Cluster{cluster2}</div>
            <div className="oasis">Oasis</div>
            <div className="ev">E/V</div>
        </div>
    )
}