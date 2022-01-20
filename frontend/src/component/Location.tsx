import '../pages/lent.css'

export default function Location(props:any){
  const handleInfo = (loc:number) => {
    props.setLidx(loc);
  }
  let location:Array<string> = props.info.location;
  return (
    <div className="dropdown" id="location">
      <button className="btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
	      <i className="bi bi-caret-down-fill"></i>
        {location ? location[props.l_idx]: ''}
      </button>
      <div className="dropdown-menu" id="locationMenu" aria-labelledby="dropdownMenuButton">
        {location?.map((loc:string, idx:number)=>{
          return <a className="dropdown-item" onClick={()=>handleInfo(idx)}>{loc}</a>
        })}
      </div>
    </div>
  )
}
