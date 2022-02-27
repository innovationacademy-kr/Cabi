import "./seromSecondFloor.css"

export function SeromSecondFloor(props:any){
    const findIdx = (name:string) => {
        return props.info?.section[props.l_idx][props.f_idx].findIndex((section:string)=>section === name) + 1;
    }
    return (
        <div className="seromSecondFloor">
            <div className="blank"></div>
            <div className="oa" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx("Cluster 1 - OA")}>
                <div className="nameTag">OA</div>
            </div>
            <div className="eoc1" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx("End of Cluster 1")}>
                <div className="nameTag">End of Cluster1</div>
            </div>
            <div className="eoc2" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx("End of Cluster 2")}>
                <div className="nameTag">End of Cluster2</div>
            </div>
            <div className="oasis" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx("Oasis")}>
                <div className="nameTag">Oasis</div>
            </div>
            <div className="ev">
                <div className="nameTag">E/V</div>    
            </div>
            <div className="terrace" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx("Cluster 1 - Terrace")}>
                <div className="nameTag">Terrace</div>  
            </div>
        </div>
    )
}
