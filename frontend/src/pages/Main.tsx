import axios from 'axios'

export default function Main(){
    const dev_url = 'http://localhost:4242/auth/login';
    const dep_url = 'http://3.38.166.176/auth/login';

    const handleClick = () => {
        axios.post(dev_url ,{
            data: 'Hello!'
        }).then((res)=>console.log(res.data)).catch((err)=>console.log(err));
    }

    return (
        <button onClick={handleClick}>
            Login
        </button>
    );
}