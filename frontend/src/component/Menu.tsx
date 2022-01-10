import './menu.css'
import {Link} from 'react-router-dom'

export default function Menu(){
  return (
      <div className="dropdown text-right" id="menu">
        <button className="btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className="h2 bi bi-list"></i>
        </button>
        <div className="dropdown-menu start-50" id="dropdownMenu" aria-labelledby="dropdownMenuButton">
          <Link className="dropdown-item" to="/lent">내 사물함 / 전체 사물함</Link>
          <a className="dropdown-item" href="#">대여 로그</a>
          <a className="dropdown-item" href="#">로그아웃</a>
        </div>
      </div>
  )
}
