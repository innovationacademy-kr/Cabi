import axios from 'axios'
import {Link} from 'react-router-dom'
import './main.css'

export default function Main(){
    const dep_url = '/auth/login';
    
    // const handleClick = () => {
    //     axios.post(dep_url, {
    //         data: 'Hello!'
    //     }).then((res)=>console.log(res.data)).catch((err)=>console.log(err));
    // }

    return (
        <div className="container">
            <div className="row p-5" id='logo'>
                <img src="../img/logo.png" alt="logo" />
            </div>
            <div className="row d-grid gap-2 col-6 mx-auto">
		<Link className="btn btn-lg" id="loginBtn" to="/auth/login">L O G I N</Link>                
            </div>
        </div>
    );
}
