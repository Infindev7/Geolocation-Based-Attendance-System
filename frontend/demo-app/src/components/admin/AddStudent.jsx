import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TbLocationCheck } from "react-icons/tb"
import './AddStudent.css'

function AddStudent() {

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const nav = useNavigate()

    const handleStudent = (e) => {
        e.preventDefault()
        axios.post("http://localhost:8080/admin/addStudent", {
            name: name,
            password: password
        }).then(() => {
            alert("Student Added Successfully")
            nav("/Admin")
        }).catch(err => {
            alert("Something Went Wrong, Please Try Again Later")
            console.error(err)
            nav("/Admin")
        })
    }

    return (
        <div className="login-container">
            <div className="login-header">
                <TbLocationCheck /> EduTrack
            </div>

            <div className="login-form-container">
                <h2>Add Student</h2>
                <p>Enter details to create a new student account.</p>
                <form onSubmit={handleStudent}>
                    <div className="input-group">
                        <label>Name</label>
                        <input type="text"
                            placeholder="Enter Student Name"
                            value={name}
                            onChange={e => { setName(e.target.value) }}
                            required />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input type="password"
                            placeholder="Enter Student Password"
                            value={password}
                            onChange={e => { setPassword(e.target.value) }}
                            required />
                    </div>
                    <button type='submit' className="login-button">Add Student</button>
                </form>
            </div>
        </div>
    )
}

export default AddStudent
