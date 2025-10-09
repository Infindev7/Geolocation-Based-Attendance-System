import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const nav = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        axios.post("http://localhost:8080/api/checkAdmin", {
            password: password
        }).then(res => {
            const {admin} = res.data
            localStorage.setItem("admin", JSON.stringify({
                admin
            }))
            nav("/admin")
        }).catch(() => {
            alert("Error: Invalid Credentials")
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" 
                        value={username}
                        onChange={(e) => {setUsername(e.target.value)}}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type='submit'>Submit</button>
            </form>
        </>
    )
}

export default AdminLogin
