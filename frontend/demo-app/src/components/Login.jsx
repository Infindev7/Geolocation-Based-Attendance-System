import axios from 'axios'
import React, { useState } from 'react'

function Login() {

    const [id, setId] = useState(0)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Username: ' + username);
        console.log('Password: ' + password);
        
        axios.post("http://localhost:8080/api/login",{
            id: id,
            username: username,
            password: password
        }).then(() => {
            alert("Successfully Logged In")
        }).catch(() => {
            alert("Invalid Credentials")
        })

        setId(0)
        setPassword("")
        setUsername("")
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div>
                    <label>Id:</label>
                    <input 
                        type="number"
                        value={id}
                        onChange={e => setUsername(e.target.value)} 
                        required
                    />
                </div>
                <div>
                    <label>Username:</label>
                    <input 
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)} 
                        required
                    />
                </div><div>
                    <label>Password:</label>
                    <input 
                        type="text"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required 
                    />
                </div>
                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}

export default Login
