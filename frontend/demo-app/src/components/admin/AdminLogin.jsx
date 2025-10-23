import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "./AdminLogin.css"
import { TbLocationCheck } from "react-icons/tb";


function AdminLogin() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const nav = useNavigate()

    useEffect(() => {
        const adminCheck = JSON.parse(localStorage.getItem("admin"))
        if(adminCheck != null && adminCheck.admin){
            nav("/admin")
        }
    })

    const handleSubmit = (e) => {
        const apiUrl = import.meta.env.VITE_API_URL
        e.preventDefault()
        axios.post(`${apiUrl}/api/checkAdmin`, {
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
        <div className="login-container">
            <div className="login-header">
                <TbLocationCheck /> EduTrack
            </div>
            <div className="login-form-container">
                <h2>Admin Sign In</h2>
                <p>Sign in to access admin panel.</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input 
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type='submit' className="login-button">Login</button>
                </form>
            </div>
        </div>
    )
}

export default AdminLogin
