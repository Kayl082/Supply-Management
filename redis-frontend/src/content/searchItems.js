import "./searchItems.css";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = 'http://localhost:5000/items';

function SearchItems() {
    const [formData, setFormData] = useState({ id: '', item_code: '', name: '', category: '', unit: '', quantity: '', date_received: '', expiration_date: '', supplier: '' });
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);

  
    // Fetch search all items
    const fetchItems = async () => {
        try {
            const response = await axios.get(API_URL);
            const sortedItems = response.data.sort((a, b) => b.id - a.id); // Sort by id in descending order (asc a.id - b.id)
            setItems(sortedItems); // Set items directly to the fetched data
            setFilteredItems([]); // Initialize filtered items with all items
        } catch (error) {
            console.error('Error fetching items:', error);
            toast.error('Error fetching items!'); // Update the error message
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);
  
    // Handle form change
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
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

    //Search by
    const handleSearch = () => {
        console.log("searchTerm:", searchTerm)
        console.log("searchby:", inputValueSearchBy)

        if (searchTerm.length > 0){
        const filtered = items.filter(item => {
            const searchValue = searchTerm.toLowerCase();
            if (inputValueSearchBy === "id") {
                return item.id.toLowerCase().includes(searchValue);
            } else if (inputValueSearchBy === "item_code") {
                return item.item_code.toLowerCase().includes(searchValue);
            } else if (inputValueSearchBy === "name") {
                return item.name.toLowerCase().includes(searchValue);
            } else if (inputValueSearchBy === "category") {
                return item.category.toLowerCase().includes(searchValue);
            } else if (inputValueSearchBy === "date_received") {
                return item.date_received.toLowerCase().includes(searchValue);
            } else if (inputValueSearchBy === "expiration_date") {
                return item.expiration_date.toLowerCase().includes(searchValue);
            } else if (inputValueSearchBy === "supplier") {
                return item.supplier.toLowerCase().includes(searchValue);
            }
            return false;
        });
        setFilteredItems(filtered);
        }
    };


    const [editModal, setEditModal] = useState(false);


    //Category dropdown
    const [inputValueCategory, setInputValueCategory] = useState('');
    // Function to update the input field when a dropdown item is selected
    const handleDropdownCategory = (value) => {
        setInputValueCategory(value); // Update the input value with the selected option
        setFormData((prevData) => ({ ...prevData, category: value }));
    };
    const handleCategoryInputChange = (e) => {
        setInputValueCategory(e.target.value);
        setFormData((prevData) => ({ ...prevData, category: e.target.value }));
    };

    //Unit dropdown
    const [inputValueUnit, setInputValueUnit] = useState('');
    // Function to update the input field when a dropdown item is selected
    const handleDropdownUnit = (value) => {
        setInputValueUnit(value); // Update the input value with the selected option
        setFormData((prevData) => ({ ...prevData, unit: value }));
    };
    const handleUnitInputChange = (e) => {
        setInputValueUnit(e.target.value);
        setFormData((prevData) => ({ ...prevData, unit: e.target.value }));
    };

    //Searchby dropdown
    const [inputValueSearchBy, setInputSearchBy] = useState("name");
    const [typeOfInput, setTypeOfInput] = useState("text");
    // Function to update the input field when a dropdown item is selected
    
    const handleSearchByInputChange = (e) => {
        setInputSearchBy(e.target.value);
    };


    

    return (
        <div className="csscontainer1">
            <div id="csssearchbar">
                <div class="input-group mb-3" id="csssearch">
                    <button className="btn btn-outline-secondary dropdown-toggle" id="cssfilter" type="button" data-bs-toggle="dropdown" aria-expanded="false" onChange={handleSearchByInputChange}>{`Search by ${inputValueSearchBy}`} </button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" onClick={() => {setInputSearchBy("id");setTypeOfInput("number");}}>ID</a></li>
                                <li><a className="dropdown-item" onClick={() => {setInputSearchBy("item_code");setTypeOfInput("text");}}>Item Code</a></li>
                                <li><a className="dropdown-item" onClick={() => {setInputSearchBy("name");setTypeOfInput("text");}}>Name</a></li>
                                <li><a className="dropdown-item" onClick={() => {setInputSearchBy("category");setTypeOfInput("text");}}>Category</a></li>
                                <li><a className="dropdown-item" onClick={() => {setInputSearchBy("date_received");setTypeOfInput("date");}}>Date Received</a></li>
                                <li><a className="dropdown-item" onClick={() => {setInputSearchBy("expiration_date");setTypeOfInput("date");}}>Expiration Date</a></li>
                                <li><a className="dropdown-item" onClick={() => {setInputSearchBy("supplier");setTypeOfInput("text");}}>Supplier</a></li>
                            </ul>
                    <input type={`${typeOfInput}`} class="form-control" placeholder={`Enter ${inputValueSearchBy}`} aria-label="Example text with button addon" aria-describedby="button-addon1" value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}/>
                    <button class="btn btn-outline-secondary" type="button" id="csssearchbutton" onClick={handleSearch}>Search</button>
                </div>

            </div>

            <div style={{ maxHeight: "350px", overflowY: "auto", border: "1px solid #ddd", position: "relative"}}>
            <table className="table table-striped table-hover table">
                <thead className="tableheader">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Item Code</th>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Unit</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Date Recieved</th>
                        <th scope="col">Expiration Date</th>
                        <th scope="col">Supplier</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody className="tablebody table-group-divider">
                    {filteredItems.map((item) => (
                        <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.item_code}</td>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>{item.unit}</td>
                        <td>{item.quantity}</td>
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
            </div>

            {/* Search Result Message */}
            {searchTerm &&(
                <div className="cssresultmessage">
                    {`${filteredItems.length} result(s) found for "${inputValueSearchBy} = ${searchTerm}"`}
                </div>
            )}

            {filteredItems.length < 1 && searchTerm.length < 1 &&(
                <div className="cssresultmessage">
                    {`Search for items..`}
                </div>
            )}


            {/* EDIT ITEM MODAL */}
            {editModal && (
                <>
                    <form onSubmit={handleEditSubmit} className="cssmodalform">
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
                                        <input name="id" value={formData.id} onChange={handleChange} required type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" readOnly/>
                                    
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
                                        <input name="category" type="text" onChange={handleCategoryInputChange} value={inputValueCategory || formData.category} class="form-control" aria-label="Text input with 2 dropdown buttons"/>
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
                                        <input name="unit "type="text" onChange={handleUnitInputChange} value={inputValueUnit || formData.unit}class="form-control" aria-label="Text input with 2 dropdown buttons"/>
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
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div> {/* Background overlay */}
                    </form>
                </>
            )}

        <ToastContainer />
        </div>
    );
}

export default SearchItems;