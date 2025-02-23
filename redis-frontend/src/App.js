import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';
import ShowItems from './content/ShowItems.js';
import SearchItems from './content/searchItems.js';
import DataVisualization from './content/dataVisualization.js';
import Signin from './content/signin.js';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedTab, setSelectedTab] = useState("signin");

    // Check localStorage for login state on initial load
    useEffect(() => {
        const storedLoginState = localStorage.getItem("isLoggedIn");
        const storedTab = localStorage.getItem("selectedTab");
        
        if (storedLoginState === "true") {
            setIsLoggedIn(true);
            setSelectedTab(storedTab || "showItems"); // Restore last visited tab
        }
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
        setSelectedTab("showItems"); // Redirect to ShowItems after login
        localStorage.setItem("isLoggedIn", "true"); // Store login state
        localStorage.setItem("selectedTab", "showItems"); // Store last visited tab
    };

    const [logoutModal, setLogoutModal] = useState(false); 

    const handleLogout = () => {
        setIsLoggedIn(false);
        setSelectedTab("signin");
        setLogoutModal(false);
        localStorage.removeItem("isLoggedIn"); // Remove login state on logout
        localStorage.removeItem("selectedTab"); // Remove stored tab on logout
    };

    useEffect(() => {
        if (isLoggedIn) {
            localStorage.setItem("selectedTab", selectedTab); //Save current tab
        }
    }, [selectedTab, isLoggedIn]);

    const tabComponents = {
        showItems: <ShowItems />,
        searchItems: <SearchItems />,
        dataVisualization: <DataVisualization />,
        signin: <Signin onLogin={handleLogin} />,
    };

    return (
        <div className="cssmain-container">
            <div className="csstoppart">
                <div className="cssheader">
                    <div className='csstitle'>
                        <h1>Supply Management</h1>
                    </div>
                </div>

                {isLoggedIn && (
                    <div className="cssnav-bar">
                        <div className="cssbootnav">
                            <nav className="navbar navbar-expand-lg">
                                <div className="container-fluid">
                                    <div className="collapse navbar-collapse" id="navbarNav">
                                        <div className="navbarNav">
                                            <ul className="navbar-nav cssnavoptions">
                                                <li className="nav-item">
                                                    <a className={`nav-link ${selectedTab === "showItems" ? "active" : ""}`} id="cssnavoption" onClick={() => setSelectedTab("showItems")}>All Items</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className={`nav-link ${selectedTab === "searchItems" ? "active" : ""}`} id="cssnavoption" onClick={() => setSelectedTab("searchItems")}>Search</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className={`nav-link ${selectedTab === "dataVisualization" ? "active" : ""}`} id="cssnavoption" onClick={() => setSelectedTab("dataVisualization")}>Data Visualizations</a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </nav>
                        </div>
                        <div className="csslogout">
                            <ul className="navbar-nav cssnavoptions">
                                <li className="nav-item" id="csslogoutbutton">
                                    <a className="nav-link" onClick={() => setLogoutModal(true)}>Logout</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* ARE YOU SURE YOuU WANT TO LOGOUT MODAL */}
            {logoutModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title"></h5>
                                    <button type="button" className="btn-close" onClick={() => setLogoutModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <h5 class="input-group mb-3">
                                        Are you sure you want to logout?
                                    </h5>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={handleLogout}>Logout</button>
                                    <button type="button" className="btn btn-light" onClick={() => setLogoutModal(false)}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div> {/* Background overlay */}
                </>
            )}

            <div className='csscontent'>
                {tabComponents[selectedTab] || <ShowItems />}
            </div>
            {/*<p id="cssfooter">Supply Management</p>*/}
        </div>
    );
}

export default App;
