import axios from 'axios'
import Location from '../component/Location' 
import Menu from '../component/Menu'
import LentModal from '../modal/LentModal'
import './lent.css'
import './main.css'


export default function Lent(){
  const dev_url = 'http://localhost:4242/lent';
    const handleClick = () => {
        axios.post(dev_url ,{
          cabinet_id: 1
        }).then((res)=>console.log(res.data)).catch((err)=>console.log(err));
        handleClick();
    }
    return (
        <div className="container col" id="container">
            <div className="row align-items-center">
              <div className="col-6">
                <Location></Location>
              </div>
              <div className="col">
                <Menu></Menu>
              </div>
            </div>
            <div className="row my-2 mx-2">
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button className="nav-link active px-5" id="nav-tab" data-bs-toggle="tab" 
                      data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">3</button>
                      <button className="nav-link px-5" id="nav-tab" data-bs-toggle="tab" 
                      data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">4</button>
                      <button className="nav-link px-5" id="nav-tab" data-bs-toggle="tab" 
                      data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">5</button>
                    </div>
                </nav>
                <div className="card tab-content" id="nav-tabContent">
                  <div className="tab-pane active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                    dfdsfastrewrtfdgdfgdfg
                  </div>
                  <div className="tab-pane" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">
                    ...
                  </div>
                  <div className="tab-pane" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">
                    ...
                  </div>
                </div>
            </div>
            <div className="btn btn-lg d-grid gap-2 col-6 mx-auto m-5" id="colorBtn" data-bs-toggle="modal" data-bs-target="#lentmodal">
              대여하기
            </div>
            <LentModal></LentModal>
        </div>
    );
}
