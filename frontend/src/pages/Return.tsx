import axios from 'axios'
// import './return.css'
import './main.css'
import ReturnModal from '../modal/ReturnModal'
import Menu from '../component/Menu'

export default function Return(){
    return (
            <div className="container">
                <div className="row-2">
                <Menu></Menu>
                </div>
                <div className="row-2">
                    메뉴
                </div>
                <div className="row-2 border">
                    대여상태
                </div>
                <div className="row-2 d-grid gap-2 col-6 mx-auto">
                    <div className="btn btn-lg disabled"  id="loginBtn">
                        연장하기
                    </div>
                </div>
                <div className="row-2 d-grid gap-2 col-6 mx-auto">  
                    <div className="btn btn-lg" id="loginBtn" data-bs-toggle="modal" data-bs-target="#returnmodal">
                        반납하기
                        </div>
                </div>
                <ReturnModal></ReturnModal>
            </div>
    )
}