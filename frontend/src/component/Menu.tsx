import './Menu.css'
import {Link} from 'react-router-dom'


export default function Menu(props:any){
  const logout = '/auth/logout';
  const cabinetPage = () =>{
    if (props.url === '/return')
      return '내 사물함';
    return '전체 사물함';
  };
  const dropdown = () =>{
    if (props.url === '/lent')
      return 'dropdownMenuReturn';
    return 'dropdownMenuLent';
  };
  return (
      <div className="dropdown text-right" id="menu">
        <button className="btn" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i className="h2 bi bi-list"></i>
        </button>
        <div className="dropdown-menu start-50" id={dropdown()} aria-labelledby="dropdownMenuButton">
          <Link className="dropdown-item" to={props.url}>{cabinetPage()}</Link>
          {/* <a className="dropdown-item" href="#">대여 로그</a> */}
          <a className="dropdown-item" href="#">로그아웃</a>
        </div>
      </div>
  )
}
