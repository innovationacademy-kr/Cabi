import '../pages/lent.css'

export default function Location(props:any){
  const handleInfo = (loc:string) => {
    props.setPresintInfo(loc);
  }
  let location:Array<string> = props.info.location;
  console.log(location);

  return (
    <div className="dropdown" id="location">
      <button className="btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
	      <i className="bi bi-caret-down-fill"></i>
        {props.presentInfo}
      </button>
      <div className="dropdown-menu" id="locationMenu" aria-labelledby="dropdownMenuButton">
        {location?.map((loc:string)=>{
          return <a className="dropdown-item" onClick={()=>handleInfo(loc)}>{loc}</a>
        })}
      </div>
    </div>
	
  )
}
