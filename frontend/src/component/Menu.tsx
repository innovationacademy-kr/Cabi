// import axios from 'axios'
// import './main.css'

export default function Menu(){
  return (
      <div className="dropdown text-right">
        <button className="btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className="h2 bi bi-list"></i>
        </button>
        <div className="dropdown-menu start-50" id="dropdownMenu" aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" href="#">내 사물함 / 전체 사물함</a>
          <a className="dropdown-item" href="#">대여 로그</a>
          <a className="dropdown-item" href="#">로그아웃</a>
        </div>
      </div>
  )
}
