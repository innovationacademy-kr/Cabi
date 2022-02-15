import "./seromSecondFloor.css"

export function SeromSecondFloor(props:any){
    const findIdx = (name:string) => {
        console.log(name);
        props.info?.section[props.l_idx][props.floor_name].map((section:any)=>{if (section != "C1 - OA") console.log(section)});
        console.log(props.info?.section[props.l_idx][props.floor_name].findIndex((section:any)=>{section === name}));
        return 3;
    }
    return (
        <div className="seromSecondFloor">
            <div className="blank"></div>
            <div className="oa" data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`} data-bs-slide-to={findIdx("C1 - OA")}>OA</div>
            <div className="eoc1">End of Cluster1</div>
            <div className="eoc2">End of Cluster2</div>
            <div className="oasis">Oasis</div>
            <div className="ev">E/V</div>
            <div className="terrace">Terrace</div>
        </div>
    )
}