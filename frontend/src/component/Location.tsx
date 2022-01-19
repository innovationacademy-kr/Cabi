import '../pages/lent.css'

export default function Location(props:any){

  const handleInfo = () => {
    
  }
  return (
    <div className="dropdown" id="location">
      <button className="btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
	      <i className="bi bi-caret-down-fill"></i>
        {props.presentInfo}
      </button>
      <div className="dropdown-menu" id="locationMenu" aria-labelledby="dropdownMenuButton">
        {props.info.location.map((loc:string)=>{
          <a className="dropdown-item">{loc}</a>
        })}
        {/* <a className="dropdown-item" href="#">새롬관</a> */}
        {/* <a className="dropdown-item" href="#">paris</a> */}
      </div>
    </div>
	
  )
}
