import axios from 'axios'
import './return.css'
import './main.css'
import Menu from '../component/Menu'
import ReturnModal from '../modal/ReturnModal'

export default function Return(){
    return (
            <div className="container" id='container'>
                <div className="row-2">
                <Menu></Menu>
                </div>
                <div className="card row-2 p-5 m-5">
                    <div className="card-body p-5 my-5">
                      <div className="card-title text-center display-5">serom 2F 42</div>
                      <div className="card-subtitle mb-2 text-muted text-center">~ 2022-01-16</div>
                    </div>
                </div>
                <div className="row-2 d-grid gap-2 col-6 mx-auto m-5">
                    <div className="btn btn-lg" id="colorBtn" data-bs-toggle="modal" data-bs-target="#returnmodal">
                        반납하기
                        </div>
                </div>
                <div className="row-2 d-grid gap-2 col-6 mx-auto m-5">
                    <div className="btn btn-lg disabled" id="colorBtn">
                        연장하기
                    </div>
                </div>
                <ReturnModal></ReturnModal>
            </div>
    )
}
