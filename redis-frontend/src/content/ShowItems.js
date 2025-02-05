import "./ShowItems.css";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:5000/items';

function ShowItems() {
    const [formData, setFormData] = useState({ id: '', item_code: '', name: '', category: '', unit: '', quantity: '', date_received: '', expiration_date: '', supplier: '' });
    const [items, setItems] = useState([]);

  
    // Fetch all items
    const fetchItems = async () => {
      try {
        const response = await axios.get(API_URL);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
  
    useEffect(() => {
      fetchItems();
    }, []);
  
    // Handle form change
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    // Add new item
    const handleAddSubmit = async (e) => {
      e.preventDefault();

      console.log('Form Data being sent:', formData);
      try {
        await axios.post(API_URL, formData);
        toast.success('Item added successfully!');
        fetchItems();
        setFormData({ id: '', item_code: '', name: '', category: '', unit: '', quantity: '', date_received: '', expiration_date: '', supplier: '' });

        setAddModal(false);
      } catch (error) {
        toast.error('Error adding item!');
      }
    };

     // Update existing item
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
        await axios.put(`${API_URL}/${formData.id}`, formData);
        toast.success('Item updated successfully!');
        fetchItems();
        setFormData({ id: '', item_code: '', name: '', category: '', unit: '', quantity: '', date_received: '', expiration_date: '', supplier: '' });
        setEditModal(false);
        } catch (error) {
        toast.error('Error updating item!');
        }
    };

    // Delete item
    const handleDelete = async (id) => {
        try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success('Item deleted!');
        fetchItems();
        } catch (error) {
        toast.error('Error deleting item!');
        }
    };

    // Populate form for updating item
    const handleEdit = (item) => {
        setEditModal(true);
        setFormData(item);
    };


    //SEARCH
    // Function to fetch items based on the search query
    const [searchTerm, setSearchTerm] = useState('');
    const fetchSearchItems = async (query) => {
        try {
        const response = await axios.get(API_URL, { params: { query } }); // Send query as a URL parameter
        setItems(response.data); // Update state with the fetched items
        } catch (error) {
        console.error('Error fetching items:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // Update searchTerm with the input value
      };

    // Effect hook to fetch items when the search term changes
    useEffect(() => {
        fetchSearchItems(searchTerm); // Fetch items when the search term changes
    }, [searchTerm]); // Trigger the effect whenever searchTerm changes


    const [addModal, setAddModal] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [addCSVModal, setAddCSVModal] = useState(false);

    const handleAddButton = () => {
        setFormData({ id: '', item_code: '', name: '', category: '', unit: '', quantity: '', date_received: '', expiration_date: '', supplier: '' });
        setAddModal(true);
    };

    //Category dropdown
    const [inputValueCategory, setInputValueCategory] = useState('');
    // Function to update the input field when a dropdown item is selected
    const handleDropdownCategory = (value) => {
        setInputValueCategory(value); // Update the input value with the selected option
    };
    //Unit dropdown
    const [inputValueUnit, setInputValueUnit] = useState('');
    // Function to update the input field when a dropdown item is selected
    const handleDropdownUnit = (value) => {
        setInputValueUnit(value); // Update the input value with the selected option
    };

    

    return (
        <div className="csscontainer1">
            <div id="csssearchbar">
                <div className="input-group mb-3" id="csssearch">
                    {/*<span className="input-group-text">
                        <div className="dropdown">
                            <button className="btn btn-secondary" id="cssfilter" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-filter fs-4" id="cssfiltericon"></i>
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </div>
                    </span>*/}
                    <input type="text" value={searchTerm} onChange={handleSearchChange} className="form-control"/>
                    <span className="input-group-text" type="submit">
                        <i className="bi bi-search fs-6" id="csssearchicon"></i>
                    </span>
                </div>
            </div>

            <table className="table table-striped table-hover table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Item Code</th>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Qty</th>
                        <th scope="col">Unit</th>
                        <th scope="col">Date Recieved</th>
                        <th scope="col">Expiration Date</th>
                        <th scope="col">Supplier</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    {items.map((item) => (
                        <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.item_code}</td>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.quantity}</td>
                        <td>{item.unit}</td>
                        <td>{item.date_received}</td>
                        <td>{item.expiration_date}</td>
                        <td>{item.supplier}</td>
                        <td>
                            <button className="btn btn-primary cssbutton" type="button"  onClick={() => handleEdit(item)}>Edit</button>
                        </td>
                        <td>
                            <button className="btn btn-primary cssbutton cssdelete" type="button" onClick={() => handleDelete(item.id)}>Delete</button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="cssbuttons">
                <button type="button" className="btn">Data Visualization</button>
                <div className="cssaddbuttons">
                    <button className="btn btn-primary cssbutton" type="button" onClick={handleAddButton}>Add</button>
                    <button className="btn btn-primary cssbutton" type="button" onClick={() => setAddCSVModal(true)}>Upload</button>
                </div>
            </div>

            {/* ADD ITEM MODAL */}
            {addModal && (
                <>
                    <form onSubmit={handleAddSubmit}>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Item</h5>
                                    <button type="button" className="btn-close" onClick={() => setAddModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">ID</span>
                                        <input name="id" value={formData.id} onChange={handleChange} required type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Item Code</span>
                                        <input name="item_code" value={formData.item_code} onChange={handleChange} required type="text" min="1" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Name</span>
                                        <input name="name" value={formData.name} onChange={handleChange} required type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Category</span>
                                        {/*<input name="category"value={formData.category} onChange={handleChange} required type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>*/}
                                        <input type="text" onChange={handleChange} value={inputValueCategory}class="form-control" aria-label="Text input with 2 dropdown buttons"/>
                                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                                        <ul class="dropdown-menu dropdown-menu-end">
                                            <li><a class="dropdown-item" onClick={() => handleDropdownCategory('Medical Supplies')}>Medical Supplies</a></li>
                                            <li><a class="dropdown-item" onClick={() => handleDropdownCategory('Laboratory Supplies')}>Laboratory Supplies</a></li>
                                            <li><a class="dropdown-item" onClick={() => handleDropdownCategory('First Aid Supplies')}>First Aid Supplies</a></li>
                                            <li><a class="dropdown-item" onClick={() => handleDropdownCategory('Office Supplies')}>Office Supplies</a></li>
                                            <li><a class="dropdown-item" onClick={() => handleDropdownCategory('Sanitation and Hygiene Supplies')}>Sanitation and Hygiene Supplies</a></li>
                                        </ul>
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Unit</span>
                                        {/*<input name="unit" value={formData.unit} onChange={handleChange} required type="text" min="1" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>*/}
                                        <input type="text" onChange={handleChange} value={inputValueUnit}class="form-control" aria-label="Text input with 2 dropdown buttons"/>
                                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false"></button>
                                        <ul class="dropdown-menu dropdown-menu-end">
                                            <li><a class="dropdown-item" onClick={() => handleDropdownUnit('peices')}>pieces</a></li>
                                            <li><a class="dropdown-item" onClick={() => handleDropdownUnit('boxes')}>boxes</a></li>
                                            <li><a class="dropdown-item" onClick={() => handleDropdownUnit('sets')}>sets</a></li>
                                            <li><a class="dropdown-item" onClick={() => handleDropdownUnit('bundles')}>bundles</a></li>
                                            <li><a class="dropdown-item" onClick={() => handleDropdownUnit('rolls')}>rolls</a></li>
                                        </ul>
                                    
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Quantity</span>
                                        <input name="quantity" value={formData.quantity} onChange={handleChange} required type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div><div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Date Received</span>
                                        <input name="date_received" value={formData.date_received} onChange={handleChange} required type="date" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Expiration Date</span>
                                        <input name="expiration_date" value={formData.expiration_date} onChange={handleChange} required type="date" min="1" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Supplier</span>
                                        <input name="supplier" value={formData.supplier} onChange={handleChange} required type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">Add Item</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div> {/* Background overlay */}
                    </form>
                </>
            )}

            {/* EDIT ITEM MODAL */}
            {editModal && (
                <>
                    <form onSubmit={handleEditSubmit}>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Item</h5>
                                    <button type="button" className="btn-close" onClick={() => setEditModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">ID</span>
                                        <input name="id" value={formData.id} onChange={handleChange} required type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Item Code</span>
                                        <input name="item_code" value={formData.item_code} onChange={handleChange} required type="text" min="1" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Name</span>
                                        <input name="name" value={formData.name} onChange={handleChange} required type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Category</span>
                                        <input name="category" value={formData.category} onChange={handleChange} required type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Unit</span>
                                        <input name="unit" value={formData.unit} onChange={handleChange} required type="text" min="1" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Quantity</span>
                                        <input name="quantity" value={formData.quantity} onChange={handleChange} required type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div><div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Date Received</span>
                                        <input name="date_received" value={formData.date_received} onChange={handleChange} required type="date" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Expiration Date</span>
                                        <input name="expiration_date" value={formData.expiration_date} onChange={handleChange} required type="date" min="1" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Supplier</span>
                                        <input name="supplier" value={formData.supplier} onChange={handleChange} required type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div> {/* Background overlay */}
                    </form>
                </>
            )}

            {/* UPLOAD CSV MODAL */}
            {addCSVModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Upload CSV File</h5>
                                    <button type="button" className="btn-close" onClick={() => setAddCSVModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div class="input-group mb-3">
                                        <input type="file" accept=".csv" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary">Upload</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div> {/* Background overlay */}
                </>
            )}
        <ToastContainer />
        </div>
    );
}

export default ShowItems;
