import "./seromFloor.css";
import { lentInfo, cabinetInfo } from "../../pages/Lent";

export function SeromFloor(props: any) {
  const cluster1: number = props.f_idx === 1 ? 3 : 5;
  const cluster2: number = props.f_idx === 1 ? 4 : 6;

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
    <div className="seromFloor">
      <div className="blank"></div>
      <div
        className="oa"
        data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`}
        data-bs-slide-to={findIdx(`Cluster ${cluster1} - OA`)}
      >
        <div className="nameTag">
          <div>OA</div>
          <div className="text-muted">
            {countLentCabinet(`Cluster ${cluster1} - OA`) +
              " / " +
              countCabinet(`Cluster ${cluster1} - OA`)}
          </div>
        </div>
      </div>
      <div
        className="eoc1"
        data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`}
        data-bs-slide-to={findIdx(`End of Cluster ${cluster1}`)}
      >
        <div className="nameTag">
          <div>{`End of Cluster ${cluster1}`}</div>
          <div className="text-muted">
            {countLentCabinet(`End of Cluster ${cluster1}`) +
              " / " +
              countCabinet(`End of Cluster ${cluster1}`)}
          </div>
        </div>
      </div>
      <div
        className="eoc2"
        data-bs-target={`#carousel_${props.l_idx}_${props.floor_name}`}
        data-bs-slide-to={findIdx(`End of Cluster ${cluster2}`)}
      >
        <div className="nameTag">
          <div>{`End of Cluster ${cluster2}`}</div>
          <div className="text-muted">
            {countLentCabinet(`End of Cluster ${cluster2}`) +
              " / " +
              countCabinet(`End of Cluster ${cluster2}`)}
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
    </div>
  );
}
