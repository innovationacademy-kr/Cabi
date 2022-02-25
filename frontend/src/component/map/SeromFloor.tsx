import cluster from "cluster";
import "./seromFloor.css"

export function SeromFloor(props:any){
    const cluster1:number = props.f_idx === 4 ? 3 : 5;
    const cluster2:number = props.f_idx === 4 ? 4 : 6;

    const findIdx = (name:string) => {
        return props.info?.section[props.l_idx][props.f_idx].findIndex((section:string)=>section === name) + 1;
    }
    return (
        <div className="seromFloor">
            <div className="blank"></div>
            <div className="oa" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx(`Cluster ${cluster1} - OA`)}>
                <div className="nameTag">{`Cluster ${cluster1} - OA`}</div>
            </div>
            <div className="eoc1" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx(`End of Cluster ${cluster1}`)}>
                <div className="nameTag">{`End of Cluster ${cluster1}`}</div>
            </div>
            <div className="eoc2" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx(`End of Cluster ${cluster2}`)}>
                <div className="nameTag">{`End of Cluster ${cluster2}`}</div>
            </div>
            <div className="oasis" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx("Oasis")}>
                <div className="nameTag">Oasis</div>
            </div>
            <div className="ev">
                <div className="nameTag">E/V</div>
            </div>
        </div>
    )
}
