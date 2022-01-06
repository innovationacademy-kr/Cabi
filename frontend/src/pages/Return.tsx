import axios from 'axios'
import './return.css'
import './main.css'
import ReturnModal from '../modal/ReturnModal'
import Menu from '../component/Menu'

export default function Return(){
    return (
            <div className="container" id='container'>
                <div className="row-2">
                <Menu></Menu>
                </div>
                <div className="card row-2 p-5 m-5">
                    <div className="card-body p-5 m-5">
                      <h1 className="card-title text-center">serom 2F 42</h1>
                      <h3 className="card-subtitle mb-2 text-muted text-center">~ 2022-01-16</h3>
                    </div>
                </div>
                <div className="row-2 d-grid gap-2 col-6 mx-auto m-5">
                    <div className="btn btn-lg disabled"  id="loginBtn">
                        연장하기
                    </div>
                </div>
                <div className="row-2 d-grid gap-2 col-6 mx-auto m-5">
                    <div className="btn btn-lg" id="loginBtn" data-bs-toggle="modal" data-bs-target="#returnmodal">
                        반납하기
                        </div>
                </div>
                <ReturnModal></ReturnModal>
            </div>
    )
}
