import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import ShowItems from './content/ShowItems.js'

function App(){
    return(
        <div className="cssmain-container">
            <div className="cssheader">
                {/*<div className="dropdown" id="cssmenuicon">
                    <button className="btn btn-secondary" id="cssmenu" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-list fs-3" id="csslist"></i>
                    </button>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">Action</a></li>
                        <li><a className="dropdown-item" href="#">Another action</a></li>
                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </div>-->*/}
                <div className='csstitle'>
                    <h1>Supply Management</h1>
                </div>
            </div>


            <div className='csscontent'>
            <ShowItems />
            </div>
        </div>
    );
}

export default App;