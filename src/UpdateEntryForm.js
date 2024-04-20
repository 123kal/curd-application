import React, { useState, useEffect } from 'react';

function UpdateEntryForm({ rowData, onCancel, onUpdate }) {
  const [name, setName] = useState(rowData.name);
  const [email, setEmail] = useState(rowData.email);
  const [phone, setPhone] = useState(rowData.phone);
  const [city, setCity] = useState(rowData.city);

  // Update form fields when rowData changes (selected row changes)
  useEffect(() => {
    setName(rowData.name);
    setEmail(rowData.email);
    setPhone(rowData.phone);
    setCity(rowData.city);
  }, [rowData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedEntry = { id: rowData.id, name, email, phone, city };
    onUpdate(updatedEntry);
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div>
      <h3>Update Entry</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <br />
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <br />
        <label>
          Phone Number:
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </label>
        <br />
        <label>
          City:
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Update</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default UpdateEntryForm;
