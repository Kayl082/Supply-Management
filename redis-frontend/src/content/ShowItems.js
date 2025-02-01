import "./ShowItems.css";

function ShowItems(){
    return(
        <div className="csscontainer1">
            <div id="csssearchbar">
                <div class="input-group mb-3" id="csssearch">
                    <span class="input-group-text">
                        <div className="dropdown">
                            <button className="btn btn-secondary" id="cssfilter" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="bi bi-filter fs-4" id="cssfiltericon"></i>
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </div>
                    </span>
                    <input type="text" class="form-control" aria-label="Amount (to the nearest dollar)"/>
                    <span class="input-group-text" type="submit">
                        <i class="bi bi-search fs-6" id="csssearchicon"></i>
                    </span>
                </div>
            </div>
            <table class="table table-striped table-hover table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">First</th>
                    <th scope="col">Last</th>
                    <th scope="col">Handle</th>
                    </tr>
                </thead>
                <tbody class="table-group-divider">
                    <tr>
                    <th scope="row">1</th>
                    <td>Mark</td>
                    <td>Otto</td>
                    <td>@mdo</td>
                    </tr>
                    <tr>
                    <th scope="row">2</th>
                    <td>Jacob</td>
                    <td>Thornton</td>
                    <td>@fat</td>
                    </tr>
                    <tr>
                    <th scope="row">3</th>
                    <td colspan="2">Larry the Bird</td>
                    <td>@twitter</td>
                    </tr>
                </tbody>
            </table>
            <div className="cssbuttons">
                <button type="button" class="btn">Data Visualization</button>
                <div className="cssaddbuttons">
                    <button class="btn btn-primary cssbutton" type="button">Add</button>
                    <button class="btn btn-primary cssbutton" type="button">Upload</button>
                </div>
            </div>

        </div>
    );
}

export default ShowItems;