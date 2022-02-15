import cluster from "cluster";
import "./seromFloor.css"

export function SeromFloor(props:any){
    const cluster1:number = props.f_idx === 4 ? 3 : 5;
    const cluster2:number = props.f_idx === 4 ? 4 : 6;

    const findIdx = (name:string) => {
        return props.info?.section[props.l_idx][props.f_idx].findIndex((section:any)=>{section === name}) + 1;
    }
    return (
        <div className="seromFloor">
            <div className="blank"></div>
            <div className="oa" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx(`Cluster ${cluster1} - OA`)}>OA</div>
            <div className="eoc1" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx(`End of Cluster ${cluster1}`)}>End of Cluster1</div>
            <div className="eoc2" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx(`End of Cluster ${cluster2}`)}>End of Cluster2</div>
            <div className="oasis" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx("Oasis")}>Oasis</div>
            <div className="ev">E/V</div>
        </div>
    )
}