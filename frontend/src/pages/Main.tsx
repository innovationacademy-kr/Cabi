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
  const url:string = "/auth/login";
  const disabed:boolean = new Date() < new Date(2022, 3, 1, 8, 0, 0, 0);
  const handleLogin = () => {
    alert("4월 1일 08시에 시작합니다!");
  }

  return (
    <div className="container">
      <div className="row p-5" id="logo">
        <img src="../img/logo.png" alt="logo" />
      </div>
      <div className="row d-grid gap-2 col-6 mx-auto">
        { disabed ?
          <div className="btn btn-lg" id="loginBtn" onClick={handleLogin}>L O G I N</div>
          : <a className="btn btn-lg" id="loginBtn" href={url}>L O G I N</a>
        }
      </div>
    </div>
  );
}
