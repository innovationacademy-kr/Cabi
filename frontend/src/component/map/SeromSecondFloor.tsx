import "./seromSecondFloor.css";
import { lentInfo, cabinetInfo } from "../../pages/Lent";

export function SeromSecondFloor(props: any) {
  const findIdx = (name: string) => {
    const idx = props.info?.section[props.l_idx][props.f_idx].findIndex(
      (section: string) => section === name
    );
    if (idx === -1) {
      return 1;
    } else {
      return idx + 1;
    }
  };
  const countCabinet = (name: string): number => {
    return props.info?.cabinet[props.l_idx][props.f_idx][findIdx(name) - 1]
      .length;
  };
  const countLentCabinet = (name: string): number => {
    let count = 0;
    props.lent?.forEach((cabi: lentInfo) => {
      if (props.info) {
        props.info.cabinet[props.l_idx][props.f_idx][findIdx(name) - 1].forEach(
          (cabinet: cabinetInfo) => {
            if (cabinet.cabinet_id === cabi.lent_cabinet_id) {
              count++;
            }
          }
        );
      }
    });
    return count;
  };
  return (
    <div className="seromSecondFloor">
      <div className="blank"></div>
      <div
        className="oa"
        data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`}
        data-bs-slide-to={findIdx("Cluster 1 - OA")}
      >
        <div className="nameTag">
          <div>OA</div>
          <div className="text-muted">
            {countLentCabinet("Cluster 1 - OA") +
              " / " +
              countCabinet("Cluster 1 - OA")}
          </div>
        </div>
      </div>
      <div
        className="eoc1"
        data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`}
        data-bs-slide-to={findIdx("End of Cluster 1")}
      >
        <div className="nameTag">
          <div>End of Cluster1</div>
          <div className="text-muted">
            {countLentCabinet("End of Cluster 1") +
              " / " +
              countCabinet("End of Cluster 1")}
          </div>
        </div>
      </div>
      <div
        className="eoc2"
        data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`}
        data-bs-slide-to={findIdx("End of Cluster 2")}
      >
        <div className="nameTag">
          <div>End of Cluster2</div>
          <div className="text-muted">
            {countLentCabinet("End of Cluster 2") +
              " / " +
              countCabinet("End of Cluster 2")}
          </div>
        </div>
      </div>
      <div
        className="oasis"
        data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`}
        data-bs-slide-to={findIdx("Oasis")}
      >
        <div className="nameTag">
          <div>🏝 Oasis</div>
          <div className="text-muted">
            {countLentCabinet("Oasis") + " / " + countCabinet("Oasis")}
          </div>
        </div>
      </div>
      <div className="ev">
        <div className="nameTag">🛗 E/V</div>
      </div>
      <div
        className="terrace"
        data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`}
        data-bs-slide-to={findIdx("Cluster 1 - Terrace")}
      >
        <div className="nameTag">
          <div>Terrace</div>
          <div className="text-muted">
            {countLentCabinet("Cluster 1 - Terrace") +
              " / " +
              countCabinet("Cluster 1 - Terrace")}
          </div>
        </div>
      </div>
    </div>
  );
}
