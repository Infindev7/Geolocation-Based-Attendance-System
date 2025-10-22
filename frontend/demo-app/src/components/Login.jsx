import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TbLocationCheck } from "react-icons/tb";
import './Login.css';

function Login() {

    const [id, setId] = useState("")
    const [password, setPassword] = useState("")
    const nav = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        
        axios.post("http://localhost:8080/api/login", {
          id: Number(id),
          password
        }).then(res => {
          const { id: sid, name, passHash } = res.data
          localStorage.setItem("userData", JSON.stringify({
            id: sid,
            name,
            passHash
          }))
          nav("/user")
        }).catch(() => {
          alert("Invalid Credentials")
        })

        setId("")
        setPassword("")
    }

    return (
        <div className="login-container">
            <div className="login-header">
                <TbLocationCheck /> EduTrack
            </div>
            <div className="login-form-container">
                <h2>Welcome Back</h2>
                <p>Sign in to mark attendance.</p>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Id</label>
                        <input 
                            type="text"
                            placeholder="Enter your Id"
                            value={id}
                            onChange={e => setId(e.target.value)} 
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

export default Login
