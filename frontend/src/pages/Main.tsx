import axios from 'axios'

export default function Main(){
        
    const handleClick = () => {
        axios.post('http://localhost:4242/auth/login',{
            data: 'Hello!'
        }).then((res)=>console.log(res.data)).catch((err)=>console.log(err));
    }

    return (
        <button onClick={handleClick}>
            Login
        </button>
    );
}