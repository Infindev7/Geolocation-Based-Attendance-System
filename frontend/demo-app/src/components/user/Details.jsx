import React, { useState } from 'react';

const Details = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() !== '') {
      onSubmit(name);
      setName('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        maxWidth: 350,
        margin: '40px auto',
        padding: '24px',
        borderRadius: '10px',
        background: '#3a3a3aff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch'
      }}
    >
      <label htmlFor="name" style={{ marginBottom: 8, fontWeight: 'bold', fontSize: 16 }}>
        Name:
      </label>
      <input
        id="name"
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Enter your name"
        style={{
          padding: '10px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          marginBottom: '18px',
          fontSize: 15
        }}
        required
      />
      <button
        type="submit"
        style={{
          padding: '10px',
          borderRadius: '5px',
          border: 'none',
          background: '#1976d2',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 16,
          cursor: 'pointer',
          transition: 'background 0.2s'
        }}
        onMouseOver={e => (e.target.style.background = '#1565c0')}
        onMouseOut={e => (e.target.style.background = '#1976d2')}
      >
        Submit
      </button>
    </form>
  );
};

export default Details;