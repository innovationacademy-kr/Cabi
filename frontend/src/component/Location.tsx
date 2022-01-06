// import axios from 'axios'
import '../pages/lent.css'

export default function Location(){
    return (
        <div className="dropdown" id="location">
          <button className="btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
		  <i className="bi bi-caret-down-fill"></i>
        새롬관
          </button>
          <div className="dropdown-menu" id="locationMenu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="#">서초</a>
            <a className="dropdown-item" href="#">paris</a>
          </div>
        </div>
	  
    )
}
