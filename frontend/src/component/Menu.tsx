// import axios from 'axios'
// import './main.css'

export default function Menu(){
  return (
      <div className="dropdown">
        <button className="btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className="h2 bi bi-list"></i>
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" href="#">내 정보</a>
          <a className="dropdown-item" href="#">설정</a>
          <a className="dropdown-item" href="#">로그아웃</a>
        </div>
        
      </div>
  )
}
