import React, { useState, useEffect } from "react";  
import axios from 'axios';  
import "./mycss/std.css";  

const Table = ({ data }) => {  
  const [rows, setRows] = useState(Array.isArray(data) ? data : []);  
  const [editIndex, setEditIndex] = useState(null);  
  const [editData, setEditData] = useState({});  
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [columns, setColumns] = useState([]); 
  const [newRow, setNewRow] = useState({});


  useEffect(() => {  
    if (Array.isArray(data) && data.length > 0) {   
      setRows(data);
      const initialColumns = Object.keys(data[0]).map((key) => ({ key, label: key.toUpperCase() })); 
      setColumns(initialColumns);  
      setNewRow(Object.fromEntries(initialColumns.map(col => [col.key, ''])));
    } else {
      setRows([]);
    }
  }, [data]);  

  useEffect(() => setCurrentPage(1), [rowsPerPage]);  

  const totalPages = Math.ceil(rows.length / rowsPerPage);  

  const handleEdit = (index) => {  
    setEditIndex(index);  
    setEditData({ ...rows[index] });  
  };  


  const handleChange = (e) => {  
    setEditData({ ...editData, [e.target.name]: e.target.value });  
  };  


  const handleSave = async () => {  
    if (editIndex !== null) {  
      const idToUpdate = editData._id; 
      const updatedRows = rows.map((row, index) => (index === editIndex ? editData : row));  
      setRows(updatedRows); 
      setEditIndex(null); 
      console.log(idToUpdate)
      try {  
        await axios.put(`http://192.168.1.22:7000/api/students/${idToUpdate}`, editData);  
        alert("Data saved successfully");  
      } catch (error) {  
        alert("Failed to update data. Please try again.");  
        setRows(rows);  
      }  
    }  
  };  


  const handleDelete = async (index) => {  
    const idToDelete = rows[index]?._id;  
    const updatedRows = rows.filter((_, i) => i !== index);  
    setRows(updatedRows);  
    try {  
      await axios.delete(`http://192.168.1.22:7000/api/students/${idToDelete}`);  
      console.log("Row deleted successfully!");  
      if (editIndex === index) {  
        setEditIndex(null);  
      } else if (editIndex > index) {  
        setEditIndex(editIndex - 1);  
      }  
    } catch (error) {   
      alert("Failed to delete data. Please check the console for details.");  
      setRows(rows);  
    }  
  };  


  const handleAddRow = async () => {  
    try {
      const validRow = Object.values(newRow).some(val => val.trim() !== "") 
      if (!validRow) {
        alert("Please enter valid data before adding a new row.");
        return;  
      }
      await axios.post("http://192.168.1.22:7000/api/students", newRow); 
      const response1= axios.get('http://192.168.1.22:7000/api/students');
      console.log(response1);
      const addedRow = response1.data;
      setRows([...rows, newRow]); 
      setNewRow(Object.fromEntries(columns.map(col => [col.key, ''])));
      console.log(newRow);
      setEditIndex(null);
      console.log("New row added successfully!");
    } catch (error) {
      console.error("Error adding new row:", error);
    }
  };


  const handleInputChange = (e) => {
    setNewRow({ ...newRow, [e.target.name]: e.target.value });
  };


  const handleNextPage = () => {  
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);  
  };  

  const handlePreviousPage = () => {  
    if (currentPage > 1) setCurrentPage(currentPage - 1);  
  };  

  const startIndex = (currentPage - 1) * rowsPerPage;  
  const selectedRows = Array.isArray(rows) ? rows.slice(startIndex, startIndex + rowsPerPage) : [];  

  return (  
    <div className="table-container">  
    <table>  
  <thead>  
    <tr>  
      {columns.map((col) => (  
        <th key={col.key}>{col.label}</th>  
      ))}  
      <th>Actions</th>  
    </tr>  
  </thead>  
  <tbody>  
  {selectedRows.map((row, index) => (  
    <tr key={startIndex + index}>  
      {columns.map((col) => (  
        <td key={col.key}>  
          {col.key === '_id' ? (   
            row[col.key]   
          ) : (                  
            editIndex === startIndex + index ? (  
              <input   
                name={col.key}
                value={editData[col.key] || ""}
                onChange={handleChange}
              />
            ) : (
              row[col.key] || "—"
            )
          )}
        </td>
      ))}
      <td>
        {editIndex === startIndex + index ? (
          <button onClick={handleSave}>Save</button>
        ) : (  
          <button onClick={() => handleEdit(startIndex + index)}>Edit</button>
        )}  
        <button onClick={() => handleDelete(startIndex + index)}>Delete</button>  
      </td>  
    </tr>  
  ))}
  <tr>
    {columns.map((col) => (
      <td key={col.key}>
        {col.key === '_id' ? (
          <p>(Auto-generated)</p>
        ) : (
          <input
            type="text"
            name={col.key}
            value={newRow[col.key] || ""}
            onChange={handleInputChange}  
          />
        )}
      </td>
    ))}
    <td><button onClick={handleAddRow}>Add</button></td>
  </tr>

</tbody>
  <tfoot>
    <tr>
      <td colSpan={columns.length - 1}>
        <label>Rows per page: </label>
        <select onChange={(e) => setRowsPerPage(Number(e.target.value))} value={rowsPerPage}>
          {[2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>  
      </td>  
      <td>  
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>&#10096;</button>  
        <button onClick={handleNextPage} disabled={currentPage >= totalPages}>&#10097;</button>  
      </td>  
    </tr>  
  </tfoot>  
</table>  
</div>  
);  
};  
export default Table;  