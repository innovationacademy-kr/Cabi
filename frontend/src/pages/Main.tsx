import axios from 'axios'
import './main.css'

export type userInfo = {
  user_id: number,
  intra_id: string,
  auth?: boolean,
  email: string,
  phone?: string,
  access: string,
  refresh: string
}

export default function Main(){
  const url = '/auth/login';

  return (
    <div className="container">
      <div className="row p-5" id='logo'>
        <img src="../img/logo.png" alt="logo" />
      </div>
      <div className="row d-grid gap-2 col-6 mx-auto">
        <a className="btn btn-lg" id="loginBtn" href={url}>L O G I N</a>
      </div>
    </div>
  );
}
