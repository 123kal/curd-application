import React, { useState, useEffect } from 'react';
import './UpdateEntryForm.css'; // Import the UpdateEntryForm CSS

function UpdateEntryForm({ selectedRow, onUpdate, onCancel }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    if (selectedRow) {
      setName(selectedRow.name);
      setEmail(selectedRow.email);
      setPhone(selectedRow.phone);
      setCity(selectedRow.city);
    }
  }, [selectedRow]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedEntry = {
      id: selectedRow.id,
      name,
      email,
      phone,
      city,
    };

    onUpdate(updatedEntry);
  };

  return (
    <div className="form-container update-form">
      <h3>Update Entry</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Phone Number:</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>City:</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
        </div>
        <div className="button-group">
          <button type="submit" className="button">Update</button>
          <button type="button" className="button cancel-button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default UpdateEntryForm;
