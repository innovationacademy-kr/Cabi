import axios from 'axios'
// import './return.css'
import './main.css'
import ReturnModal from '../modal/ReturnModal'

export default function Return(){
    return (
            <div className="container" id="container">
                <div className="row-3">
                    메뉴
                </div>
                <div className="row-3 border">
                    대여상태
                </div>
                <div className="row-3 d-grid gap-2 col-6 mx-auto">
                    <div className="btn btn-lg disabled"  id="loginBtn">
                        연장하기
                    </div>
                </div>
                <div className="row-3 d-grid gap-2 col-6 mx-auto">  
                    <div className="btn btn-lg" id="loginBtn" data-bs-toggle="modal" data-bs-target="#returnmodal">
                        반납하기
                        </div>
                </div>
                <ReturnModal></ReturnModal>
            </div>
    )
}