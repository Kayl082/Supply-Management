import "./ShowItems.css";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import Papa from "papaparse";
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
        const sortedItems = response.data.sort((a, b) => b.id - a.id); // Sort by id in descending order (asc a.id - b.id)
        setItems(sortedItems);
        
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

      try {
        await axios.post(API_URL, formData);
        toast.success('Item added successfully!');
        fetchItems();
        setAddModal(false);
      } catch (error) {
        if (error.response && error.response.status === 409) {
          toast.warning(error.response.data.message); // Show warning toast if item already exists
        } else {
          toast.error('Error adding item!');
        }
      }
      setFormData({ id: '', item_code: '', name: '', category: '', unit: '', quantity: '', date_received: '', expiration_date: '', supplier: '' });
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
    const [deleteModal, setDeleteModal] = useState(false);
    const [itemIDToDelete, setitemIDToDelete] = useState();

    const deleteItem = async (id) => {
        setDeleteModal(true);
        setitemIDToDelete(id);
        console.log(id);
        console.log(itemIDToDelete);
    };

    const handleDelete = async (id) => {
        try {
        await axios.delete(`${API_URL}/${id}`);
        toast.success('Item deleted!');
        fetchItems();
        } catch (error) {
        toast.error('Error deleting item!');
        }
        setDeleteModal(false);
    };

    // Populate form for updating item
    const handleEdit = (item) => {
        setEditModal(true);
        setFormData(item);
    };


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


    //File Upload
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
          toast.error("Please select a CSV file.");
          return;
        }
    
        Papa.parse(file, {
          complete: async (result) => {
    
            const items = result.data.map((row) => ({ // result.data.slice(1).map((row) 
                id: row[0]?.toString().trim(),
                item_code: row[1]?.toString().trim(),
                name: row[2]?.toString().trim(),
                category: row[3]?.toString().trim(),
                unit: row[4]?.toString().trim(),
                quantity: row[5]?.toString().trim(),
                date_received: row[6]?.toString().trim(),
                expiration_date: row[7]?.toString().trim(),
                supplier: row[8]?.toString().trim(),
            }));
        
            try {
              const response = await fetch("http://localhost:5000/upload-csv", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ items }),
              });
              const data = await response.json();
              if (response.ok) {
                toast.success("CSV uploaded successfully!");
                fetchItems();
                setAddCSVModal(false);
              } else if (response.status === 409 && Array.isArray(data.message) && data.message.length > 0) {
                toast.success("CSV uploaded successfully!");

                toast.warning(`Some items were skipped:\n${data.message.join("\n")}`, {
                  autoClose: false, // Prevent auto-closing for better visibility
                  position: "top-right",
                });
                fetchItems();
                setAddCSVModal(false);
              }
            } catch (error) {
              console.error("Error uploading file:", error);
              toast.error("Error uploading file.");
            }
          },
          header: false,
          skipEmptyLines: true,
          dynamicTyping: false, // Ensures all data is treated as a string
        });
    };
    
    
    

    return (
        <div className="csscontainer1">
            <div className="cssbuttons">
                <div className="cssaddbuttons">
                    <button className="btn btn-primary cssbutton" type="button" onClick={handleAddButton}>Add Item</button>
                    <button className="btn btn-primary cssbutton" type="button" onClick={() => setAddCSVModal(true)}>Upload CSV File</button>
                </div>
            </div>

            <div style={{ maxHeight: "350px", overflowY: "auto", border: "1px solid #ddd"}}>
            <table className="table table-striped table-hover table">
                <thead className="tableheader">
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Item Code</th>
                        <th scope="col">Name</th>
                        <th scope="col">Category</th>
                        <th scope="col">Unit</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Date Received</th>
                        <th scope="col">Expiration Date</th>
                        <th scope="col">Supplier</th>
                        <th scope="col"></th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody className="tablebody">
                    {items.map((item) => (
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
                                <button className="btn btn-primary cssbutton" type="button" onClick={() => handleEdit(item)}>Edit</button>
                            </td>
                            <td>
                                <button className="btn btn-primary cssbutton cssdelete" type="button" onClick={() => deleteItem(item.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>

            {/* ADD ITEM MODAL */}
            {addModal && (
                <>
                    <form onSubmit={handleAddSubmit} className="cssmodalform">
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
                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="inputGroup-sizing-sm">Expiration Date</span>
                                        
                                        <input 
                                            name="expiration_date" 
                                            value={formData.expiration_date === "N/A" ? "" : formData.expiration_date} 
                                            onChange={handleChange} 
                                            type="date" 
                                            className="form-control" 
                                            aria-label="Sizing example input" 
                                            aria-describedby="inputGroup-sizing-sm" 
                                            disabled={formData.expiration_date === "N/A"}
                                        />
                                        
                                        <div className="input-group-text">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.expiration_date === "N/A"} 
                                                onChange={(e) => 
                                                    setFormData({
                                                        ...formData, 
                                                        expiration_date: e.target.checked ? "N/A" : ""
                                                    })
                                                } 
                                            />
                                            <span className="ms-2">Not Applicable</span>
                                        </div>
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
                                        <input name="id" value={formData.id} onChange={handleChange} required type="number" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm" readOnly />
                                    
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Item Code</span>
                                        <input name="item_code" value={formData.item_code} onChange={handleChange} required type="text" min="1" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Name</span>
                                        <input name="name" value={formData.name} onChange={handleChange} required type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                    <div class="input-group mb-3">
                                        <span class="input-group-text" id="inputGroup-sizing-sm">Category</span>
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
                                    <div className="input-group mb-3">
                                        <span className="input-group-text" id="inputGroup-sizing-sm">Expiration Date</span>
                                        
                                        <input 
                                            name="expiration_date" 
                                            value={formData.expiration_date === "N/A" ? "" : formData.expiration_date} 
                                            onChange={handleChange} 
                                            type="date" 
                                            className="form-control" 
                                            aria-label="Sizing example input" 
                                            aria-describedby="inputGroup-sizing-sm" 
                                            disabled={formData.expiration_date === "N/A"}
                                        />
                                        
                                        <div className="input-group-text">
                                            <input 
                                                type="checkbox" 
                                                checked={formData.expiration_date === "N/A"} 
                                                onChange={(e) => 
                                                    setFormData({
                                                        ...formData, 
                                                        expiration_date: e.target.checked ? "N/A" : ""
                                                    })
                                                } 
                                            />
                                            <span className="ms-2">Not Applicable</span>
                                        </div>
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
                                        <input type="file" accept=".csv" onChange={handleFileChange} class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-sm"/>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={handleUpload}>Upload</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop fade show"></div> {/* Background overlay */}
                </>
            )}

            {/* ARE YOU SURE DELETE MODAL */}
            {deleteModal && (
                <>
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title"></h5>
                                    <button type="button" className="btn-close" onClick={() => setDeleteModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <h5 class="input-group mb-3">
                                        Are you sure you want to delete Item ID: {itemIDToDelete}?
                                    </h5>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-danger" onClick={() => handleDelete(itemIDToDelete)}>Delete</button>
                                    <button type="button" className="btn btn-light" onClick={() => setDeleteModal(false)}>Cancel</button>
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