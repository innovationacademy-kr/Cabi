import axios from 'axios'
import './main.css'

export default function Main(){
  const local_url = 'http://localhost:2424/auth/login';
  const dev_url = '/auth/login';

  return (
    <div className="container">
      <div className="row p-5" id='logo'>
        <img src="../img/logo.png" alt="logo" />
      </div>
      <div className="row d-grid gap-2 col-6 mx-auto">
        <a className="btn btn-lg" id="loginBtn" href={dev_url}>L O G I N</a>
      </div>
    </div>
  );
}
