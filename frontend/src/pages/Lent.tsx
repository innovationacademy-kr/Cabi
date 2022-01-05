// import axios from 'axios'
import Menu from '../component/Menu' 
import './lent.css'

export default function Lent(){
    return (
        <div className="container">
            <div className="row-2">
                <Menu></Menu>
            </div>
            <div className="row border my-2 mx-2">
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button className="nav-link active px-2" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">Home</button>
                      <button className="nav-link px-2" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Profile</button>
                      <button className="nav-link px-2" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Contact</button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">hello!!</div>
                  <div className="tab-pane" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab">...</div>
                  <div className="tab-pane" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab">...</div>
                </div>
            </div>
        </div>
    );
}
