import "../pages/lent.css";
import { locationInfo } from "../redux/slices/cabinetSlice";

interface LocationProps {
  info: locationInfo;
  l_idx: number;
  setLidx: React.Dispatch<React.SetStateAction<number>>;
}

export default function Location(props: LocationProps) {
  let location: Array<string> | undefined = props.info.location;

  const handleInfo = (loc: number) => {
    props.setLidx(loc);
  };
  return (
    <div className="dropdown" id="location">
      <button
        className="btn"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <i className="bi bi-caret-down-fill"></i>
        {location ? location[props.l_idx] : ""}
      </button>
      <div
        className="dropdown-menu"
        id="locationMenu"
        aria-labelledby="dropdownMenuButton"
      >
        {location?.map((loc: string, idx: number) => {
          return (
            <a className="dropdown-item" onClick={() => handleInfo(idx)} key={idx}>
              {loc}
            </a>
          );
        })}
      </div>
    </div>
  );
}
