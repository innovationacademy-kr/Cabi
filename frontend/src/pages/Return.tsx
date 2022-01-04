import axios from 'axios'
// import './return.css'
// import './main.css'


export default function Return(){
    return (
        <div className="container h-100 border col-12">
            <div className="row-3">
                메뉴
            </div>
            <div className="row-3 border">
                대여상태
            </div>
            <div className="row-3 d-grid gap-2 col-6 mx-auto">
                <div className="btn btn-lg" id="loginBtn">
                    연장하기
                </div>
            </div>
            <div className="row-3 d-grid gap-2 col-6 mx-auto">
                <div className="btn btn-lg" id="loginBtn">
                    반납하기
                </div>
            </div>
        </div>

    )
}