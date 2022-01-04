import axios from 'axios'
import './main.css'

export default function Main(){
    const dev_url = 'http://localhost:4242/auth/login';
    const dep_url = 'https://cabi/42cadet.kr/auth/login';

    const handleClick = () => {
        axios.post(dev_url ,{
            data: 'Hello!'
        }).then((res)=>console.log(res.data)).catch((err)=>console.log(err));
    }

    return (
        <div className="container">
            <div className="col">
                <div className="row">42cabi</div>
                <div className="row">
                    <div className="btn btn-lg col-3" id="loginBtn" onClick={handleClick}>
                        Login
                    </div>
                </div>
            </div>
        </div>
    );
}
