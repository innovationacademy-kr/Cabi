import axios from 'axios'

export default function Main(){
    const dev_url = 'http://localhost:4242/auth/login';
    const dep_url = 'http://cabi.42cadet.kr/auth/login';

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
