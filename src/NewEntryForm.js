import React, { useState } from 'react';
import './NewEntryForm.css'; // Import the NewEntryForm CSS

function NewEntryForm({ onAdd }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !phone || !city) {
      alert('All fields are required!');
      return;
    }

    const newEntry = { name, email, phone, city };
    onAdd(newEntry);

    setName('');
    setEmail('');
    setPhone('');
    setCity('');
  };

  return (
    <div className="form-container new-entry-form">
      <h3>Add New Entry</h3>
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
        <button type="submit" className="button">Submit</button>
      </form>
    </div>
  );
}

export default NewEntryForm;
