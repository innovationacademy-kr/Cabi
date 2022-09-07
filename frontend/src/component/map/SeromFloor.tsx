import "./seromFloor.css";
import { cabinetInfo, locationInfo } from "../../redux/slices/cabinetSlice";
import { lentInfo } from "../../redux/slices/lentSlice";

interface SeromFloorProps {
  info: locationInfo;
  l_idx: number;
  f_idx: number;
  floor_name: number;
  lent: lentInfo[];
}

export function SeromFloor(props: SeromFloorProps) {
  const cluster1: number = props.f_idx === 1 ? 3 : 5;
  const cluster2: number = props.f_idx === 1 ? 4 : 6;

  const findIdx = (name: string) => {
    // const idx = props.info?.section[props.l_idx][props.f_idx].findIndex(
    //   (section: string) => section === name
    // );
    const idx: number = props.info.section[props.l_idx][props.f_idx].findIndex(
      (section: string) => section === name
    );
    if (idx === -1) {
      // FIXME Before (idx === -1)
      // info의 타입 locationInfo 내부 프로퍼티들이 전부 선택적 프로퍼티임
      // props.info?.section 에 옵셔널 체이닝으로 section?. 으로 수정
      // 이로 인해 idx에 들어올 수 있는 값이 number | undefined 로 바뀜
      // 그래서 조건에 idx === undefined 추가했는데 이게 맞나..요?
      return 1;
    } else {
      return idx + 1;
    }
  };
  const countCabinet = (name: string): number => {
    return props.info.cabinet[props.l_idx][props.f_idx][findIdx(name) - 1]
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
