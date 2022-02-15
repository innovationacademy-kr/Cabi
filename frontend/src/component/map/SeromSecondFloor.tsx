import "./seromSecondFloor.css"

export function SeromSecondFloor(props:any){
    const findIdx = (name:string) => {
        return props.info?.section[props.l_idx][props.f_idx].findIndex((section:string)=>section === name) + 1;
    }
    return (
        <div className="seromSecondFloor">
            <div className="blank"></div>
            <div className="oa" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx("Cluster 1 - OA")}>OA</div>
            <div className="eoc1" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx("End of Cluster 1")}>End of Cluster1</div>
            <div className="eoc2" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx("End of Cluster 2")}>End of Cluster2</div>
            <div className="oasis" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx("Oasis")}>Oasis</div>
            <div className="ev">E/V</div>
            <div className="terrace" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx("Cluster 1 - Terrace")}>Terrace</div>
        </div>
    )
}
