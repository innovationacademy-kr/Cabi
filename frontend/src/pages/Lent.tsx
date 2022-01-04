import axios from 'axios'
import Menu from '../component/Menu' 
// import './return.css'
// import './main.css'


export default function Lent(){
    return (
        <div className="container h-100 border col-12">
            <div className="row-2">
                <Menu></Menu>
            </div>
            <div className="row border">
                대여 사물함
            </div>
        </div>
    )
}