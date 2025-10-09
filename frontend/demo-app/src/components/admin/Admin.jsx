import React, { useState } from 'react'

function Admin() {
  const [items, setItems] = useState(['Alice', 'Bob'])
  const [text, setText] = useState('')

  const addItem = () => {
    if (!text.trim()) return
    setItems(prev => [...prev, text.trim()]) // add
    setText('')
  }

  const removeItem = (idx) => {
    setItems(prev => prev.filter((_, i) => i !== idx)) // remove
  }

  return (
    <div>
      <h1>Users</h1>

      <div>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Add name" />
        <button onClick={addItem}>Add</button>
      </div>

      <ul>
        {items.map((name, idx) => (
          <li key={name + idx}>
            {name}
            <button onClick={() => removeItem(idx)} style={{ marginLeft: 8 }}>x</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Admin
